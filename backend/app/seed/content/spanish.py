"""
Rich Spanish curriculum for the Duolingo Clone.
Authoring Unit 1 ("Say hello"), Unit 2 ("Food and drinks"), and Unit 3 ("Family and people").
Includes exercises covering all 5 core types + bonus listening exercises.
"""

from typing import Any


def get_spanish_course() -> dict[str, Any]:
    return {
        "course": {
            "title": "Spanish",
            "learning_language_code": "es",
            "from_language_code": "en",
            "flag_emoji": "🇪🇸",
            "description": "Master essential Spanish through bite-sized, interactive lessons.",
        },
        "sections": [
            {
                "order_index": 1,
                "title": "Rookie",
                "description": "Start fresh with the core foundations of Spanish.",
                "units": [
                    # -------------------------------------------------------------
                    # UNIT 1: Say hello
                    # -------------------------------------------------------------
                    {
                        "order_index": 1,
                        "title": "Say hello",
                        "description": "Greet people, introduce yourself, and order basic items.",
                        "theme_color": "#58CC02",  # feather
                        "theme_shadow_color": "#58A700",
                        "guidebook_md": (
                            "# Unit 1: Say hello\n\n"
                            "### Key Phrases\n"
                            "- **¡Hola!** = Hello!\n"
                            "- **Buenos días** = Good morning\n"
                            "- **Buenas noches** = Good evening / Good night\n"
                            "- **Por favor** = Please\n"
                            "- **Muchas gracias** = Thank you very much\n\n"
                            "### Grammar Tip: Gender in Spanish\n"
                            "Nouns in Spanish are either masculine or feminine:\n"
                            "- **el** niño (the boy) / **un** hombre (a man)\n"
                            "- **la** niña (the girl) / **una** mujer (a woman)\n"
                        ),
                        "skills": [
                            {
                                "order_index": 1,
                                "kind": "skill",
                                "title": "Basics 1",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_basics_1_lessons(),
                            },
                            {
                                "order_index": 2,
                                "kind": "skill",
                                "title": "Greetings",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_greetings_lessons(),
                            },
                            {
                                "order_index": 3,
                                "kind": "skill",
                                "title": "Introductions",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_introductions_lessons(),
                            },
                            {
                                "order_index": 4,
                                "kind": "skill",
                                "title": "Basics 2",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_basics_2_lessons(),
                            },
                            {
                                "order_index": 5,
                                "kind": "chest",
                                "title": "Unit 1 Treasure Chest",
                                "icon_key": "chest",
                                "total_levels": 1,
                                "lessons": [],
                            },
                        ],
                    },
                    # -------------------------------------------------------------
                    # UNIT 2: Food and drinks
                    # -------------------------------------------------------------
                    {
                        "order_index": 2,
                        "title": "Food and drinks",
                        "description": "Order food, drink names, plurals, and restaurant phrases.",
                        "theme_color": "#1CB0F6",  # macaw
                        "theme_shadow_color": "#1899D6",
                        "guidebook_md": (
                            "# Unit 2: Food & Drinks\n\n"
                            "### Useful Vocabulary\n"
                            "- **la manzana** = apple 🍎\n"
                            "- **el pan** = bread 🍞\n"
                            "- **el agua** = water 💧\n"
                            "- **la leche** = milk 🥛\n"
                            "- **el café** = coffee ☕\n\n"
                            "### Verbs\n"
                            "- **Yo como** = I eat\n"
                            "- **Tú comes** = You eat\n"
                            "- **Yo bebo** = I drink\n"
                            "- **Tú bebes** = You drink\n"
                        ),
                        "skills": [
                            {
                                "order_index": 1,
                                "kind": "skill",
                                "title": "Food 1",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_food_1_lessons(),
                            },
                            {
                                "order_index": 2,
                                "kind": "skill",
                                "title": "Drinks",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_drinks_lessons(),
                            },
                            {
                                "order_index": 3,
                                "kind": "skill",
                                "title": "Plurals",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_plurals_lessons(),
                            },
                            {
                                "order_index": 4,
                                "kind": "skill",
                                "title": "At the Café",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_cafe_lessons(),
                            },
                            {
                                "order_index": 5,
                                "kind": "chest",
                                "title": "Unit 2 Treasure Chest",
                                "icon_key": "chest",
                                "total_levels": 1,
                                "lessons": [],
                            },
                        ],
                    },
                    # -------------------------------------------------------------
                    # UNIT 3: Family and people
                    # -------------------------------------------------------------
                    {
                        "order_index": 3,
                        "title": "Family and people",
                        "description": "Talk about your family, friends, pets, and descriptions.",
                        "theme_color": "#CE82FF",  # beetle
                        "theme_shadow_color": "#A568CC",
                        "guidebook_md": (
                            "# Unit 3: Family & People\n\n"
                            "### Family Members\n"
                            "- **la madre** = mother\n"
                            "- **el padre** = father\n"
                            "- **el hermano** = brother\n"
                            "- **la hermana** = sister\n\n"
                            "### Pets\n"
                            "- **el perro** = dog 🐶\n"
                            "- **el gato** = cat 🐱\n"
                        ),
                        "skills": [
                            {
                                "order_index": 1,
                                "kind": "skill",
                                "title": "Family",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_family_lessons(),
                            },
                            {
                                "order_index": 2,
                                "kind": "skill",
                                "title": "Descriptions",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_descriptions_lessons(),
                            },
                            {
                                "order_index": 3,
                                "kind": "skill",
                                "title": "Animals",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_animals_lessons(),
                            },
                            {
                                "order_index": 4,
                                "kind": "skill",
                                "title": "Possessives",
                                "icon_key": "star",
                                "total_levels": 3,
                                "lessons": build_possessives_lessons(),
                            },
                            {
                                "order_index": 5,
                                "kind": "unit_review",
                                "title": "Unit 3 Trophy Review",
                                "icon_key": "trophy",
                                "total_levels": 1,
                                "lessons": build_unit_review_lessons(),
                            },
                        ],
                    },
                ],
            }
        ],
    }


# =============================================================================
# UNIT 1 LESSON GENERATORS
# =============================================================================
def build_basics_1_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Which of these is “the boy”?",
                "prompt_text": "the boy",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "el niño",
                "options": [
                    {"text": "el niño", "emoji": "👦", "is_correct": True},
                    {"text": "la niña", "emoji": "👧", "is_correct": False},
                    {"text": "la mujer", "emoji": "👩", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "multiple_choice",
                "instruction": "Which of these is “the apple”?",
                "prompt_text": "the apple",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "la manzana",
                "options": [
                    {"text": "la manzana", "emoji": "🍎", "is_correct": True},
                    {"text": "el pan", "emoji": "🍞", "is_correct": False},
                    {"text": "la leche", "emoji": "🥛", "is_correct": False},
                ],
            },
            {
                "order_index": 3,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Yo soy un hombre",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Yo soy un hombre",
                "correct_answer": "I am a man",
                "accepted_answers": ["I am a man", "I'm a man"],
                "options": [
                    {"text": "I", "correct_position": 1},
                    {"text": "am", "correct_position": 2},
                    {"text": "a", "correct_position": 3},
                    {"text": "man", "correct_position": 4},
                    {"text": "woman"},
                    {"text": "boy"},
                ],
            },
            {
                "order_index": 4,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "el niño", "side": "left", "pair_group": 1},
                    {"text": "the boy", "side": "right", "pair_group": 1},
                    {"text": "la niña", "side": "left", "pair_group": 2},
                    {"text": "the girl", "side": "right", "pair_group": 2},
                    {"text": "el hombre", "side": "left", "pair_group": 3},
                    {"text": "the man", "side": "right", "pair_group": 3},
                    {"text": "la mujer", "side": "left", "pair_group": 4},
                    {"text": "the woman", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 5,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "I am a girl",
                "sentence_with_blank": "Yo soy una ____.",
                "options": [
                    {"text": "niña", "is_correct": True},
                    {"text": "niño", "is_correct": False},
                    {"text": "hombre", "is_correct": False},
                ],
            },
            {
                "order_index": 6,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "I am a boy",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "Yo soy un niño",
                "accepted_answers": ["Yo soy un niño", "Soy un niño"],
            },
            {
                "order_index": 7,
                "type": "listen_tap",
                "instruction": "Tap what you hear",
                "prompt_text": "Una mujer",
                "audio_text": "Una mujer",
                "correct_answer": "Una mujer",
                "accepted_answers": ["Una mujer", "una mujer"],
                "options": [
                    {"text": "Una", "correct_position": 1},
                    {"text": "mujer", "correct_position": 2},
                    {"text": "hombre"},
                    {"text": "niña"},
                ],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_greetings_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Select the correct translation",
                "prompt_text": "¡Hola!",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "¡Hola!",
                "options": [
                    {"text": "Hello!", "emoji": "👋", "is_correct": True},
                    {"text": "Goodbye!", "emoji": "🚶", "is_correct": False},
                    {"text": "Please", "emoji": "🙏", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Buenos días, mucho gusto",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Buenos días, mucho gusto",
                "correct_answer": "Good morning nice to meet you",
                "accepted_answers": [
                    "Good morning nice to meet you",
                    "Good morning, nice to meet you",
                ],
                "options": [
                    {"text": "Good", "correct_position": 1},
                    {"text": "morning", "correct_position": 2},
                    {"text": "nice", "correct_position": 3},
                    {"text": "to", "correct_position": 4},
                    {"text": "meet", "correct_position": 5},
                    {"text": "you", "correct_position": 6},
                    {"text": "night"},
                    {"text": "goodbye"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "Hola", "side": "left", "pair_group": 1},
                    {"text": "Hello", "side": "right", "pair_group": 1},
                    {"text": "Adiós", "side": "left", "pair_group": 2},
                    {"text": "Goodbye", "side": "right", "pair_group": 2},
                    {"text": "Gracias", "side": "left", "pair_group": 3},
                    {"text": "Thank you", "side": "right", "pair_group": 3},
                    {"text": "Por favor", "side": "left", "pair_group": 4},
                    {"text": "Please", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "Good night, goodbye",
                "sentence_with_blank": "Buenas ____, adiós.",
                "options": [
                    {"text": "noches", "is_correct": True},
                    {"text": "días", "is_correct": False},
                    {"text": "tardes", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "Thank you very much",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "Muchas gracias",
                "accepted_answers": ["Muchas gracias", "Muchas gracias."],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_introductions_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "What does this mean?",
                "prompt_text": "¿Cómo te llamas?",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "¿Cómo te llamas?",
                "options": [
                    {"text": "What is your name?", "is_correct": True},
                    {"text": "How are you?", "is_correct": False},
                    {"text": "Where are you from?", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Me llamo Sofia",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Me llamo Sofia",
                "correct_answer": "My name is Sofia",
                "accepted_answers": ["My name is Sofia", "I am Sofia"],
                "options": [
                    {"text": "My", "correct_position": 1},
                    {"text": "name", "correct_position": 2},
                    {"text": "is", "correct_position": 3},
                    {"text": "Sofia", "correct_position": 4},
                    {"text": "Your"},
                    {"text": "call"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "yo", "side": "left", "pair_group": 1},
                    {"text": "I", "side": "right", "pair_group": 1},
                    {"text": "tú", "side": "left", "pair_group": 2},
                    {"text": "you", "side": "right", "pair_group": 2},
                    {"text": "él", "side": "left", "pair_group": 3},
                    {"text": "he", "side": "right", "pair_group": 3},
                    {"text": "ella", "side": "left", "pair_group": 4},
                    {"text": "she", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "I am from Spain",
                "sentence_with_blank": "Yo soy ____ España.",
                "options": [
                    {"text": "de", "is_correct": True},
                    {"text": "en", "is_correct": False},
                    {"text": "con", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "My name is Juan",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "Me llamo Juan",
                "accepted_answers": ["Me llamo Juan", "Mi nombre es Juan"],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_basics_2_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Which of these is “the water”?",
                "prompt_text": "the water",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "el agua",
                "options": [
                    {"text": "el agua", "emoji": "💧", "is_correct": True},
                    {"text": "el pan", "emoji": "🍞", "is_correct": False},
                    {"text": "la leche", "emoji": "🥛", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Sí, yo hablo español",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Sí, yo hablo español",
                "correct_answer": "Yes I speak Spanish",
                "accepted_answers": ["Yes I speak Spanish", "Yes, I speak Spanish"],
                "options": [
                    {"text": "Yes", "correct_position": 1},
                    {"text": "I", "correct_position": 2},
                    {"text": "speak", "correct_position": 3},
                    {"text": "Spanish", "correct_position": 4},
                    {"text": "No"},
                    {"text": "drink"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "sí", "side": "left", "pair_group": 1},
                    {"text": "yes", "side": "right", "pair_group": 1},
                    {"text": "no", "side": "left", "pair_group": 2},
                    {"text": "no", "side": "right", "pair_group": 2},
                    {"text": "el", "side": "left", "pair_group": 3},
                    {"text": "the (masc.)", "side": "right", "pair_group": 3},
                    {"text": "la", "side": "left", "pair_group": 4},
                    {"text": "the (fem.)", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "Do you speak English?",
                "sentence_with_blank": "¿Tú ____ inglés?",
                "options": [
                    {"text": "hablas", "is_correct": True},
                    {"text": "hablo", "is_correct": False},
                    {"text": "bebes", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "No, I do not speak English",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "No, no hablo inglés",
                "accepted_answers": [
                    "No, no hablo inglés",
                    "No no hablo inglés",
                    "No, yo no hablo inglés",
                ],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


# =============================================================================
# UNIT 2 LESSON GENERATORS
# =============================================================================
def build_food_1_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Which of these is “the bread”?",
                "prompt_text": "the bread",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "el pan",
                "options": [
                    {"text": "el pan", "emoji": "🍞", "is_correct": True},
                    {"text": "el queso", "emoji": "🧀", "is_correct": False},
                    {"text": "la manzana", "emoji": "🍎", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Yo como una manzana",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Yo como una manzana",
                "correct_answer": "I eat an apple",
                "accepted_answers": ["I eat an apple", "I am eating an apple"],
                "options": [
                    {"text": "I", "correct_position": 1},
                    {"text": "eat", "correct_position": 2},
                    {"text": "an", "correct_position": 3},
                    {"text": "apple", "correct_position": 4},
                    {"text": "bread"},
                    {"text": "drinks"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "la manzana", "side": "left", "pair_group": 1},
                    {"text": "the apple", "side": "right", "pair_group": 1},
                    {"text": "el pan", "side": "left", "pair_group": 2},
                    {"text": "the bread", "side": "right", "pair_group": 2},
                    {"text": "el queso", "side": "left", "pair_group": 3},
                    {"text": "the cheese", "side": "right", "pair_group": 3},
                    {"text": "el arroz", "side": "left", "pair_group": 4},
                    {"text": "the rice", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "The boy eats bread",
                "sentence_with_blank": "El niño ____ pan.",
                "options": [
                    {"text": "come", "is_correct": True},
                    {"text": "como", "is_correct": False},
                    {"text": "comes", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "I eat cheese",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "Yo como queso",
                "accepted_answers": ["Yo como queso", "Como queso"],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_drinks_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Which of these is “the milk”?",
                "prompt_text": "the milk",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "la leche",
                "options": [
                    {"text": "la leche", "emoji": "🥛", "is_correct": True},
                    {"text": "el café", "emoji": "☕", "is_correct": False},
                    {"text": "el agua", "emoji": "💧", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Él bebe café caliente",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Él bebe café caliente",
                "correct_answer": "He drinks hot coffee",
                "accepted_answers": ["He drinks hot coffee", "He is drinking hot coffee"],
                "options": [
                    {"text": "He", "correct_position": 1},
                    {"text": "drinks", "correct_position": 2},
                    {"text": "hot", "correct_position": 3},
                    {"text": "coffee", "correct_position": 4},
                    {"text": "tea"},
                    {"text": "cold"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "el agua", "side": "left", "pair_group": 1},
                    {"text": "water", "side": "right", "pair_group": 1},
                    {"text": "la leche", "side": "left", "pair_group": 2},
                    {"text": "milk", "side": "right", "pair_group": 2},
                    {"text": "el café", "side": "left", "pair_group": 3},
                    {"text": "coffee", "side": "right", "pair_group": 3},
                    {"text": "el té", "side": "left", "pair_group": 4},
                    {"text": "tea", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "Do you drink water?",
                "sentence_with_blank": "¿Tú ____ agua?",
                "options": [
                    {"text": "bebes", "is_correct": True},
                    {"text": "bebo", "is_correct": False},
                    {"text": "bebe", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "I drink milk",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "Yo bebo leche",
                "accepted_answers": ["Yo bebo leche", "Bebo leche"],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_plurals_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Select the plural form of “el niño”",
                "prompt_text": "the boys",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "los niños",
                "options": [
                    {"text": "los niños", "is_correct": True},
                    {"text": "las niñas", "is_correct": False},
                    {"text": "el niños", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Las niñas comen manzanas",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Las niñas comen manzanas",
                "correct_answer": "The girls eat apples",
                "accepted_answers": ["The girls eat apples", "The girls are eating apples"],
                "options": [
                    {"text": "The", "correct_position": 1},
                    {"text": "girls", "correct_position": 2},
                    {"text": "eat", "correct_position": 3},
                    {"text": "apples", "correct_position": 4},
                    {"text": "boys"},
                    {"text": "breads"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "los", "side": "left", "pair_group": 1},
                    {"text": "the (masc. pl.)", "side": "right", "pair_group": 1},
                    {"text": "las", "side": "left", "pair_group": 2},
                    {"text": "the (fem. pl.)", "side": "right", "pair_group": 2},
                    {"text": "unos", "side": "left", "pair_group": 3},
                    {"text": "some (masc.)", "side": "right", "pair_group": 3},
                    {"text": "unas", "side": "left", "pair_group": 4},
                    {"text": "some (fem.)", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "The apples are red",
                "sentence_with_blank": "____ manzanas son rojas.",
                "options": [
                    {"text": "Las", "is_correct": True},
                    {"text": "Los", "is_correct": False},
                    {"text": "La", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "The men drink water",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "Los hombres beben agua",
                "accepted_answers": ["Los hombres beben agua"],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_cafe_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "How do you ask for the bill?",
                "prompt_text": "The check, please",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "La cuenta, por favor",
                "options": [
                    {"text": "La cuenta, por favor", "is_correct": True},
                    {"text": "El menú, por favor", "is_correct": False},
                    {"text": "El café, por favor", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Yo quiero una mesa para dos",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Yo quiero una mesa para dos",
                "correct_answer": "I want a table for two",
                "accepted_answers": ["I want a table for two"],
                "options": [
                    {"text": "I", "correct_position": 1},
                    {"text": "want", "correct_position": 2},
                    {"text": "a", "correct_position": 3},
                    {"text": "table", "correct_position": 4},
                    {"text": "for", "correct_position": 5},
                    {"text": "two", "correct_position": 6},
                    {"text": "one"},
                    {"text": "chair"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "la cuenta", "side": "left", "pair_group": 1},
                    {"text": "the bill", "side": "right", "pair_group": 1},
                    {"text": "la mesa", "side": "left", "pair_group": 2},
                    {"text": "the table", "side": "right", "pair_group": 2},
                    {"text": "el mesero", "side": "left", "pair_group": 3},
                    {"text": "the waiter", "side": "right", "pair_group": 3},
                    {"text": "¿cuánto cuesta?", "side": "left", "pair_group": 4},
                    {"text": "how much is it?", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "I want a coffee, please",
                "sentence_with_blank": "Quiero un ____, por favor.",
                "options": [
                    {"text": "café", "is_correct": True},
                    {"text": "pan", "is_correct": False},
                    {"text": "leche", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "How much does it cost?",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "¿Cuánto cuesta?",
                "accepted_answers": ["¿Cuánto cuesta?", "Cuanto cuesta?", "Cuánto cuesta"],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


# =============================================================================
# UNIT 3 LESSON GENERATORS
# =============================================================================
def build_family_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Which of these is “the mother”?",
                "prompt_text": "the mother",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "la madre",
                "options": [
                    {"text": "la madre", "emoji": "👩", "is_correct": True},
                    {"text": "el padre", "emoji": "👨", "is_correct": False},
                    {"text": "el hermano", "emoji": "👦", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "Mi hermano vive en Madrid",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "Mi hermano vive en Madrid",
                "correct_answer": "My brother lives in Madrid",
                "accepted_answers": ["My brother lives in Madrid"],
                "options": [
                    {"text": "My", "correct_position": 1},
                    {"text": "brother", "correct_position": 2},
                    {"text": "lives", "correct_position": 3},
                    {"text": "in", "correct_position": 4},
                    {"text": "Madrid", "correct_position": 5},
                    {"text": "sister"},
                    {"text": "works"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "la madre", "side": "left", "pair_group": 1},
                    {"text": "the mother", "side": "right", "pair_group": 1},
                    {"text": "el padre", "side": "left", "pair_group": 2},
                    {"text": "the father", "side": "right", "pair_group": 2},
                    {"text": "el hermano", "side": "left", "pair_group": 3},
                    {"text": "the brother", "side": "right", "pair_group": 3},
                    {"text": "la hermana", "side": "left", "pair_group": 4},
                    {"text": "the sister", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "My father is tall",
                "sentence_with_blank": "Mi padre es ____.",
                "options": [
                    {"text": "alto", "is_correct": True},
                    {"text": "alta", "is_correct": False},
                    {"text": "altos", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "My sister is friendly",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "Mi hermana es simpática",
                "accepted_answers": [
                    "Mi hermana es simpática",
                    "Mi hermana es simpatica",
                    "Mi hermana es amable",
                ],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_descriptions_lessons() -> list[dict[str, Any]]:
    return build_dummy_or_typed_lessons("Descriptions", "grande", "big", "pequeño", "small")


def build_animals_lessons() -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": "Which of these is “the dog”?",
                "prompt_text": "the dog",
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": "el perro",
                "options": [
                    {"text": "el perro", "emoji": "🐶", "is_correct": True},
                    {"text": "el gato", "emoji": "🐱", "is_correct": False},
                    {"text": "el pájaro", "emoji": "🐦", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": "El gato duerme mucho",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": "El gato duerme mucho",
                "correct_answer": "The cat sleeps a lot",
                "accepted_answers": ["The cat sleeps a lot", "The cat sleeps much"],
                "options": [
                    {"text": "The", "correct_position": 1},
                    {"text": "cat", "correct_position": 2},
                    {"text": "sleeps", "correct_position": 3},
                    {"text": "a", "correct_position": 4},
                    {"text": "lot", "correct_position": 5},
                    {"text": "dog"},
                    {"text": "eats"},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": "el perro", "side": "left", "pair_group": 1},
                    {"text": "the dog", "side": "right", "pair_group": 1},
                    {"text": "el gato", "side": "left", "pair_group": 2},
                    {"text": "the cat", "side": "right", "pair_group": 2},
                    {"text": "el pájaro", "side": "left", "pair_group": 3},
                    {"text": "the bird", "side": "right", "pair_group": 3},
                    {"text": "el caballo", "side": "left", "pair_group": 4},
                    {"text": "the horse", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": "I have a pet",
                "sentence_with_blank": "Yo tengo una ____.",
                "options": [
                    {"text": "mascota", "is_correct": True},
                    {"text": "perro", "is_correct": False},
                    {"text": "gato", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": "The dog is happy",
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": "El perro está feliz",
                "accepted_answers": ["El perro está feliz", "El perro esta feliz"],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons


def build_possessives_lessons() -> list[dict[str, Any]]:
    return build_dummy_or_typed_lessons("Possessives", "mi", "my", "tu", "your")


def build_unit_review_lessons() -> list[dict[str, Any]]:
    return build_dummy_or_typed_lessons("Unit Review", "hola", "hello", "gracias", "thank you")


def build_dummy_or_typed_lessons(
    title: str, word_es: str, word_en: str, word2_es: str, word2_en: str
) -> list[dict[str, Any]]:
    lessons = []
    for level in range(1, 4 if title != "Unit Review" else 2):
        ex = [
            {
                "order_index": 1,
                "type": "multiple_choice",
                "instruction": f"Select the translation for “{word_en}”",
                "prompt_text": word_en,
                "prompt_language": "en",
                "target_language": "es",
                "audio_text": word_es,
                "options": [
                    {"text": word_es, "is_correct": True},
                    {"text": word2_es, "is_correct": False},
                    {"text": "otro", "is_correct": False},
                ],
            },
            {
                "order_index": 2,
                "type": "translate_word_bank",
                "instruction": "Translate this sentence",
                "prompt_text": f"Es {word_es}",
                "prompt_language": "es",
                "target_language": "en",
                "audio_text": f"Es {word_es}",
                "correct_answer": f"It is {word_en}",
                "accepted_answers": [f"It is {word_en}", f"It's {word_en}"],
                "options": [
                    {"text": "It", "correct_position": 1},
                    {"text": "is", "correct_position": 2},
                    {"text": word_en, "correct_position": 3},
                    {"text": "not"},
                    {"text": word2_en},
                ],
            },
            {
                "order_index": 3,
                "type": "match_pairs",
                "instruction": "Tap the matching pairs",
                "options": [
                    {"text": word_es, "side": "left", "pair_group": 1},
                    {"text": word_en, "side": "right", "pair_group": 1},
                    {"text": word2_es, "side": "left", "pair_group": 2},
                    {"text": word2_en, "side": "right", "pair_group": 2},
                    {"text": "sí", "side": "left", "pair_group": 3},
                    {"text": "yes", "side": "right", "pair_group": 3},
                    {"text": "no", "side": "left", "pair_group": 4},
                    {"text": "no", "side": "right", "pair_group": 4},
                ],
            },
            {
                "order_index": 4,
                "type": "fill_in_blank",
                "instruction": "Complete the sentence",
                "prompt_text": f"It is {word_en}",
                "sentence_with_blank": f"Es ____.",
                "options": [
                    {"text": word_es, "is_correct": True},
                    {"text": word2_es, "is_correct": False},
                    {"text": "algo", "is_correct": False},
                ],
            },
            {
                "order_index": 5,
                "type": "type_answer",
                "instruction": "Type in Spanish",
                "prompt_text": word_en,
                "prompt_language": "en",
                "target_language": "es",
                "correct_answer": word_es,
                "accepted_answers": [word_es],
            },
        ]
        lessons.append({"level_number": level, "xp_reward": 10, "exercises": ex})
    return lessons
