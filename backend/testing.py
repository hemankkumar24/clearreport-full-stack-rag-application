import json
import re

def fix_numbers_with_commas(json_str):
    def replace_commas_in_numbers(match):
        return str(int(match.group(0).replace(",", "")))
    
    json_str = re.sub(r'(?<!")\b\d{1,3}(?:,\d{3})+\b(?!")', replace_commas_in_numbers, json_str)
    json_str = re.sub(r'"(\d{1,3}(?:,\d{3})+)"', lambda m: str(int(m.group(1).replace(",", ""))), json_str)
    
    return json_str

def return_status(text_accepted):
    test = fix_numbers_with_commas(text_accepted)

    if isinstance(test, str):
        try:
            variable = json.loads(test)
        except json.JSONDecodeError:
            print("Invalid JSON string.")
            return None
    else:
        print("Provided data is not a string.")
        return None

    print(variable.get('patient', 'Unknown Patient'))

    for t in variable.get('tests', []):
        try:
            low = t.get('normal_range', [None, None])[0]
            high = t.get('normal_range', [None, None])[1]
            result = t.get('result', None)

            if result is None:
                raise ValueError("Missing result")

            if isinstance(low, str) and low.startswith(('>', '<')):
                threshold = float(low[1:])
                if low.startswith('>'):
                    t['status'] = 'normal' if result > threshold else 'low'
                else:
                    t['status'] = 'normal' if result < threshold else 'high'
                t['normal_range'] = low

            elif isinstance(high, str) and high.startswith(('>', '<')):
                threshold = float(high[1:])
                if high.startswith('<'):
                    t['status'] = 'normal' if result < threshold else 'high'
                else:
                    t['status'] = 'normal' if result > threshold else 'low'

            elif high is None or low is None:
                t['status'] = "unsure"
                t['normal_range'] = t.get('normal_range', [None, None])

            else:
                if float(low) <= result <= float(high):
                    t['status'] = "normal"
                elif result > float(high):
                    t['status'] = 'high'
                elif result < float(low):
                    t['status'] = 'low'

        except Exception as e:
            print(f"Skipping test due to error: {e}")
            # Force safe defaults so DB insert won't fail
            t.setdefault('normal_range', "0")
            t.setdefault('status', "None")
            continue

    return variable
