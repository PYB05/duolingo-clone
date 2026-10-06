"""
Answer checking rules (Section 7.2). Pure functions — no database access.

The lesson service loads the exercise from the DB, converts it into the small
dataclasses below, and calls these functions. That keeps every rule unit-testable.
"""

import re
import unicodedata
from dataclasses import dataclass, field
from typing import Optional

# Punctuation we ignore when comparing typed answers.
_PUNCTUATION = re.compile(r"[.,!?¿¡;:\"'“”‘’«»()\-]")
_WHITESPACE = re.compile(r"\s+")


@dataclass
class CheckResult:
    """Outcome of checking one answer."""

    is_correct: bool
    is_typo: bool = False
    # A short hint shown in the feedback bar, e.g. "Pay attention to accents."
    note: Optional[str] = None
    # The accepted answer the submission matched (used for "Another correct solution")
    matched: Optional[str] = None


@dataclass
class OptionData:
    """The subset of an ExerciseOption the checker needs."""

    id: int
    text: str
    is_correct: bool = False
    correct_position: Optional[int] = None
    pair_group: Optional[int] = None
    side: Optional[str] = None


@dataclass
class ExerciseData:
    """The subset of an Exercise the checker needs."""

    type: str
    correct_answer: Optional[str] = None
    accepted_answers: list[str] = field(default_factory=list)
    options: list[OptionData] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Text helpers
# ---------------------------------------------------------------------------
def normalize(text: str) -> str:
    """NFC, lowercase, strip punctuation, trim and collapse whitespace."""
    text = unicodedata.normalize("NFC", text).lower()
    text = _PUNCTUATION.sub(" ", text)
    return _WHITESPACE.sub(" ", text).strip()


def strip_accents(text: str) -> str:
    """Remove diacritics: 'está' -> 'esta', 'niño' -> 'nino'."""
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")


def levenshtein(a: str, b: str) -> int:
    """
    Classic edit distance (insert / delete / substitute = 1).
    Dynamic programming with a single rolling row: O(len(a) * len(b)).
    """
    if a == b:
        return 0
    if not a:
        return len(b)
    if not b:
        return len(a)
    previous = list(range(len(b) + 1))
    for i, char_a in enumerate(a, start=1):
        current = [i]
        for j, char_b in enumerate(b, start=1):
            cost = 0 if char_a == char_b else 1
            current.append(
                min(
                    previous[j] + 1,  # deletion
                    current[j - 1] + 1,  # insertion
                    previous[j - 1] + cost,  # substitution
                )
            )
        previous = current
    return previous[-1]


def allowed_typos(answer: str) -> int:
    """Answers of 6+ characters tolerate one typo; shorter ones must be exact."""
    return 1 if len(answer) >= 6 else 0


# ---------------------------------------------------------------------------
# Per-type checkers
# ---------------------------------------------------------------------------
def check_text(submission: str, accepted: list[str]) -> CheckResult:
    """
    Compare a typed sentence against all accepted answers.

    Order of rules:
      1. exact match after normalisation          -> correct
      2. match only after removing accents        -> correct, typo ("Pay attention to accents.")
      3. edit distance within tolerance           -> correct, typo ("You have a typo.")
      4. otherwise                                -> wrong
    """
    sub = normalize(submission)
    if not sub:
        return CheckResult(is_correct=False)

    candidates = [(a, normalize(a)) for a in accepted if a and a.strip()]

    for original, norm in candidates:
        if sub == norm:
            return CheckResult(is_correct=True, matched=original)

    sub_plain = strip_accents(sub)
    for original, norm in candidates:
        if sub_plain == strip_accents(norm):
            return CheckResult(
                is_correct=True, is_typo=True, note="Pay attention to accents.", matched=original
            )

    for original, norm in candidates:
        if levenshtein(sub_plain, strip_accents(norm)) <= allowed_typos(norm):
            return CheckResult(is_correct=True, is_typo=True, note="You have a typo.", matched=original)

    return CheckResult(is_correct=False)


def check_option(selected_id: Optional[int], options: list[OptionData]) -> CheckResult:
    """Multiple choice / fill in the blank: the selected option must be the correct one."""
    for option in options:
        if option.id == selected_id:
            return CheckResult(is_correct=option.is_correct)
    return CheckResult(is_correct=False)


def check_word_bank(
    token_ids: Optional[list[int]], text: Optional[str], exercise: ExerciseData
) -> CheckResult:
    """
    Word bank: rebuild the sentence from the tapped tiles (or use raw text if sent),
    then compare it like a typed answer. Typos are impossible with tiles, so a
    'typo' match from tiles is treated as wrong — tiles must form an accepted answer.
    """
    if token_ids:
        by_id = {o.id: o.text for o in exercise.options}
        if any(t not in by_id for t in token_ids):
            return CheckResult(is_correct=False)
        text = " ".join(by_id[t] for t in token_ids)
    result = check_text(text or "", _all_accepted(exercise))
    if result.is_typo and token_ids:
        return CheckResult(is_correct=False)
    return result


def check_pairs(pairs: list[list[int]], options: list[OptionData]) -> CheckResult:
    """Match pairs: every submitted (left, right) must share a pair_group, and all pairs present."""
    by_id = {o.id: o for o in options}
    left_ids = {o.id for o in options if o.side == "left"}
    seen: set[int] = set()
    for pair in pairs:
        if len(pair) != 2:
            return CheckResult(is_correct=False)
        left, right = by_id.get(pair[0]), by_id.get(pair[1])
        if left is None or right is None or left.side == right.side:
            return CheckResult(is_correct=False)
        if left.pair_group is None or left.pair_group != right.pair_group:
            return CheckResult(is_correct=False)
        seen.add(left.id if left.side == "left" else right.id)
    return CheckResult(is_correct=seen == left_ids)


def _all_accepted(exercise: ExerciseData) -> list[str]:
    answers = list(exercise.accepted_answers)
    if exercise.correct_answer:
        answers.insert(0, exercise.correct_answer)
    return answers


def check_answer(exercise: ExerciseData, answer: dict) -> CheckResult:
    """
    Dispatch on exercise type. `answer` is the JSON body the client sent:
      {option_id} | {tokens:[...]} | {text} | {pairs:[[l,r],...], wrong_attempts}
    """
    kind = exercise.type
    if kind in ("multiple_choice", "fill_in_blank"):
        return check_option(answer.get("option_id"), exercise.options)
    if kind in ("translate_word_bank", "listen_tap"):
        return check_word_bank(answer.get("tokens"), answer.get("text"), exercise)
    if kind in ("type_answer", "listen_type"):
        return check_text(str(answer.get("text") or ""), _all_accepted(exercise))
    if kind == "match_pairs":
        return check_pairs(answer.get("pairs") or [], exercise.options)
    if kind == "speak":
        # Speaking is a placeholder: never counted as a mistake.
        return CheckResult(is_correct=True)
    return CheckResult(is_correct=False)
