import re

def tokenize(text: str):
    tokens = re.findall(r"\w+", text.lower())
    return tokens