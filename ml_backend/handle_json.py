import json

with open('output.json', 'r') as file:
    data = json.load(file)

for key, value in data['patient'].items():
    print(f"{key} : {value}")

print("-"*25)

for types in data['tests']:
    for key, value in types.items():
        print(f"{key} : {value}")
    print()
    
    
