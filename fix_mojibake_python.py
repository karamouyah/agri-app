import json

filepath = "shared/algeria-locations.json"
with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# Make the exact replacements
replacements = {
    "SÃ©tif": "Sétif",
    "SaÃ¯da": "Saïda",
    "AbbÃ¨s": "Abbès",
    "MÃ©dÃ©a": "Médéa",
    "BÃ©jaÃ¯a": "Béjaïa",
    "TÃ©bessa": "Tébessa",
    "BÃ©char": "Béchar",
    "AÃ¯n": "Aïn",
    "Ã©": "é",
    "Ã¯": "ï",
    "Ã¨": "è",
    "Ã¢": "â",
    "Ã´": "ô",
    "Ã»": "û",
    "Ã§": "ç",
}

for old, new in replacements.items():
    text = text.replace(old, new)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(text)

print("JSON file has been correctly formatted in pure Python.")
