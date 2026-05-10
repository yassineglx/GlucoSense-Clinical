import json
import re

notebook_path = r'd:\myprojects\diabete_tracking\diabete_risk\notebooks\diabetes-prediction.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        source = "".join(cell['source'])
        if '.fit(' in source and ('XGB' in source or 'RandomForest' in source):
            print("--- FOUND FIT ---")
            print(source)

