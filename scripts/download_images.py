import csv
import json
import os
import urllib.request
import time
from pathlib import Path

# Read CSV file
csv_path = r'c:\Users\migut\Desktop\workout_data (1).csv'
print(f"Reading CSV from: {csv_path}")

exercises = set()
try:
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if 'exercise_title' in row and row['exercise_title']:
                exercises.add(row['exercise_title'])
except Exception as e:
    print(f"Error reading CSV: {e}")
    exit(1)

exercise_list = sorted(list(exercises))
print(f"\nFound {len(exercise_list)} unique exercises:")
for i, exercise in enumerate(exercise_list, 1):
    print(f"  {i}. {exercise}")

# Create images directory
images_dir = Path(r'c:\Users\migut\migutse Gym\client\public\exercise-images')
images_dir.mkdir(parents=True, exist_ok=True)
print(f"\nCreated directory: {images_dir}")

# Download images
UNSPLASH_API_KEY = 'BxKxgKxSa2JKGjlXc6Mg_MdNH7FfZZXAYs9nfhTGNYo'
image_mapping = {}
download_count = 0
fail_count = 0

print(f"\nDownloading images for {len(exercise_list)} exercises...\n")

for exercise in exercise_list:
    try:
        # Fetch from Unsplash
        url = f"https://api.unsplash.com/search/photos?query={urllib.parse.quote(exercise)}&per_page=1&orientation=landscape&client_id={UNSPLASH_API_KEY}"
        
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            if data.get('results') and len(data['results']) > 0:
                image_url = data['results'][0]['urls']['regular']
                image_name = f"{exercise.lower().replace(' ', '-')}.jpg"
                image_path = images_dir / image_name
                
                try:
                    print(f"Downloading: {exercise}...", end=' ')
                    urllib.request.urlretrieve(image_url, str(image_path))
                    image_mapping[exercise] = f"/exercise-images/{image_name}"
                    download_count += 1
                    print("✓")
                except Exception as e:
                    fail_count += 1
                    print(f"✗ (failed to save)")
            else:
                fail_count += 1
                print(f"✗ {exercise} - no image found")
            
            # Rate limiting
            time.sleep(0.2)
    except Exception as e:
        fail_count += 1
        print(f"✗ {exercise} - {str(e)[:50]}")

# Save mapping file
mapping_path = Path(r'c:\Users\migut\migutse Gym\client\public\exercise-images.json')
with open(mapping_path, 'w', encoding='utf-8') as f:
    json.dump(image_mapping, f, indent=2)

print(f"\n✓ Saved mapping to: {mapping_path}")
print(f"\nSummary: Downloaded {download_count}, Failed {fail_count}")
