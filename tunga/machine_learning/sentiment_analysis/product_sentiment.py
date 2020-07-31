import random

def get_sentiment(text):
    r = random.randint(0, 1)
    return ["negative", "positive"][r]
