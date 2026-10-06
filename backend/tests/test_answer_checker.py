"""
Tests for answer_checker pure rules.
"""

from app.services.answer_checker import (
    ExerciseData,
    OptionData,
    check_answer,
    check_text,
    levenshtein,
    normalize,
    strip_accents,
)


def test_normalize():
    assert normalize("  ¡Hola,  Mundo!  ") == "hola mundo"
    assert normalize("¿Cómo estás?") == "cómo estás"


def test_strip_accents():
    assert strip_accents("está") == "esta"
    assert strip_accents("niño") == "nino"


def test_levenshtein():
    assert levenshtein("apple", "apple") == 0
    assert levenshtein("apple", "apply") == 1
    assert levenshtein("apple", "bpple") == 1
    assert levenshtein("", "abc") == 3


def test_check_text_exact():
    res = check_text("el niño", ["el niño"])
    assert res.is_correct is True
    assert res.is_typo is False


def test_check_text_accents_typo():
    res = check_text("el nino", ["el niño"])
    assert res.is_correct is True
    assert res.is_typo is True
    assert "accents" in res.note.lower()


def test_check_text_minor_typo():
    # length >= 6
    res = check_text("manzanaa", ["manzana"])
    assert res.is_correct is True
    assert res.is_typo is True
    assert "typo" in res.note.lower()


def test_check_text_wrong():
    res = check_text("perro", ["manzana"])
    assert res.is_correct is False


def test_check_multiple_choice():
    ex = ExerciseData(
        type="multiple_choice",
        options=[
            OptionData(id=1, text="la manzana", is_correct=True),
            OptionData(id=2, text="el pan", is_correct=False),
        ],
    )
    assert check_answer(ex, {"option_id": 1}).is_correct is True
    assert check_answer(ex, {"option_id": 2}).is_correct is False


def test_check_match_pairs():
    ex = ExerciseData(
        type="match_pairs",
        options=[
            OptionData(id=1, text="el niño", side="left", pair_group=1),
            OptionData(id=2, text="the boy", side="right", pair_group=1),
            OptionData(id=3, text="la niña", side="left", pair_group=2),
            OptionData(id=4, text="the girl", side="right", pair_group=2),
        ],
    )
    # Correct pairs
    assert check_answer(ex, {"pairs": [[1, 2], [3, 4]]}).is_correct is True
    # Wrong pair
    assert check_answer(ex, {"pairs": [[1, 4], [3, 2]]}).is_correct is False
    # Incomplete
    assert check_answer(ex, {"pairs": [[1, 2]]}).is_correct is False
