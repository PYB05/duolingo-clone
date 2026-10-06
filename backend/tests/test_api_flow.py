"""
Integration tests for the complete lesson and gamification API flow.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_api_full_flow():
    # 1. /me
    me_res = client.get("/api/v1/me")
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["username"] == "learner"
    assert me_data["hearts"] >= 1
    assert "settings" in me_data

    # 2. /course
    course_res = client.get("/api/v1/course")
    assert course_res.status_code == 200
    course_data = course_res.json()
    assert len(course_data["sections"]) >= 1
    unit1 = course_data["sections"][0]["units"][0]
    assert len(unit1["skills"]) >= 4

    # 3. Start a lesson (Basics 1 level 1)
    start_res = client.post("/api/v1/lessons/1/start")
    assert start_res.status_code == 200
    start_data = start_res.json()
    attempt_id = start_data["attempt_id"]
    exercises = start_data["exercises"]
    assert len(exercises) >= 5

    # 4. Answer the first exercise
    ex1 = exercises[0]
    corr_opt_id = ex1["options"][0]["id"]
    # Send multiple choice answer
    ans_res = client.post(
        f"/api/v1/attempts/{attempt_id}/answer",
        json={"exercise_id": ex1["id"], "answer": {"option_id": corr_opt_id}},
    )
    assert ans_res.status_code == 200
    ans_data = ans_res.json()
    assert "is_correct" in ans_data
    assert "progress" in ans_data

    # 5. Leaderboard
    lb_res = client.get("/api/v1/leaderboard")
    assert lb_res.status_code == 200
    lb_data = lb_res.json()
    assert len(lb_data["standings"]) >= 20
    assert lb_data["tier"] == 1

    # 6. Quests
    q_res = client.get("/api/v1/quests")
    assert q_res.status_code == 200
    q_data = q_res.json()
    assert len(q_data["daily_quests"]) >= 3

    # 7. Shop
    shop_res = client.get("/api/v1/shop")
    assert shop_res.status_code == 200
    shop_data = shop_res.json()
    assert len(shop_data["items"]) >= 2

    # 8. Dev time travel
    dev_res = client.post("/api/v1/dev/time-travel", json={"days": 1})
    assert dev_res.status_code == 200
    assert "simulated_today" in dev_res.json()
