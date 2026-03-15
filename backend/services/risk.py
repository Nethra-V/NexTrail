def calculate_risk(battery, tamper, mode):

    score = 0

    if battery < 20:
        score += 30

    if tamper:
        score += 50

    if mode == "transit":
        score += 10

    return min(score, 100)