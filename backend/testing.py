import json
import re 

def fix_numbers_with_commas(json_str):
    def replace_commas_in_numbers(match):
        return str(int(match.group(0).replace(",", "")))
    
    json_str = re.sub(r'(?<!")\b\d{1,3}(?:,\d{3})+\b(?!")', replace_commas_in_numbers, json_str)
    json_str = re.sub(r'"(\d{1,3}(?:,\d{3})+)"', lambda m: str(int(m.group(1).replace(",", ""))), json_str)
    
    return json_str

def return_status(text_accepted):
    test = text_accepted
    test = fix_numbers_with_commas(test)
    if isinstance(test, str):
        try:
            print(test)
            variable = json.loads(test)
        except json.JSONDecodeError:
            print("Invalid JSON string.")
            
    print(variable['patient'])

    for test in variable['tests']:
        print(f"test: {test}")
        low = test['normal_range'][0]
        high = test['normal_range'][1]
        result = test['result']

        if isinstance(low, str) and low.startswith(('>', '<')):
            threshold = float(low[1:])
            if low.startswith('>'):
                test['status'] = 'normal' if result > threshold else 'low'
            else:
                test['status'] = 'normal' if result < threshold else 'high'
                
            test['normal_range'] = low

        elif isinstance(high, str) and high.startswith(('>', '<')):
            threshold = float(high[1:])
            if high.startswith('<'):
                test['status'] = 'normal' if result < threshold else 'high'
            else:
                test['status'] = 'normal' if result > threshold else 'low'
                
        elif high == None:
            test['status'] = "unsure"    

        else:
            if float(low) <= result <= float(high):
                test['status'] = "normal"
            elif result > float(high):
                test['status'] = 'high'
            elif result < float(low):
                test['status'] = 'low'
                
    return(variable)