import json
import pandas as pd
from pathlib import Path

# Read JSON file
json_file_path = Path('assets/files/val.json')
excel_file_path = Path('assets/files/val.xlsx')

print("Reading JSON file...")
with open(json_file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Found {len(data)} records")

# Convert to DataFrame
df = pd.DataFrame(data)

print(f"Columns: {list(df.columns)}")
print(f"Total rows: {len(df)}")

# Export to Excel
print("Converting to Excel...")
df.to_excel(excel_file_path, index=False, sheet_name='Data', engine='openpyxl')

print(f"✓ Successfully converted to Excel: {excel_file_path}")
print(f"  - Total records: {len(df)}")
print(f"  - Total columns: {len(df.columns)}")
