import os, requests, time

JUDGE0_URL = "https://judge0-ce.p.rapidapi.com"
HEADERS = {
    "X-RapidAPI-Key": os.getenv("JUDGE0_KEY"),
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    "content-type": "application/json"
}

def run_code(source, language_id, stdin):
    res = requests.post(
        f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=true",
        headers=HEADERS,
        json={"language_id": language_id, "source_code": source, "stdin": stdin},
        timeout=20,
    )
    res.raise_for_status()
    return res.json()
