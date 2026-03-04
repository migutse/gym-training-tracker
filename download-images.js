#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Common exercises based on typical Hevy exports
const exercises = [
  'Barbell Bench Press',
  'Dumbbell Bench Press',
  'Barbell Squat',
  'Leg Press',
  'Barbell Deadlift',
  'Romanian Deadlift',
  'Leg Curl',
  'Leg Extension',
  'Barbell Row',
  'Dumbbell Row',
  'Lat Pulldown',
  'Barbell Overhead Press',
  'Dumbbell Shoulder Press',
  'Cable Machine Chest Fly',
  'Dumbbell Lateral Raise',
  'Barbell Curl',
  'Dumbbell Curl',
  'Barbell Tricep Extension',
  'Cable Tricep Pushdown',
  'Tricep Rope Pushdown',
  'Leg Raises',
  'Ab Wheel',
  'Cable Wood Chop',
  'Pull-ups',
  'Chin-ups',
  'Machine Leg Press',
  'Smith Machine Bench Press',
  'Incline Dumbbell Press',
  'Dumbbell Flyes',
  'Machine Leg Curl',
  'Hack Squat',
  'Walking Lunges',
  'Bulgarian Split Squat',
  'Leg Press',
  'Cable Fly',
  'Chest Press Machine',
  'Seated Row',
  'Back Extension',
  'Cable Pull Through',
  'Glute Kickback',
  'Hip Thrust',
  'Plate Loaded Leg Press',
  'Smith Machine Squat',
  'Machine Shoulder Press',
  'Lateral Raise Machine',
  'Tricep Dip Machine',
  'Leg Curl Machine'
];

const imagesDir = path.join(__dirname, '..', 'client', 'public', 'exercise-images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const UNSPLASH_API_KEY = 'BxKxgKxSa2JKGjlXc6Mg_MdNH7FfZZXAYs9nfhTGNYo';
let imageMapping = {};
let completed = 0;

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    https.get(url, (response) => {
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
      file.on('error', () => resolve(false));
    }).on('error', () => resolve(false));
  });
}

async function fetchImage(exercise) {
  return new Promise((resolve) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(exercise)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_API_KEY}`;
    
    https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', async () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            resolve(json.results[0].urls.regular);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function downloadAllImages() {
  console.log(`\nDownloading ${exercises.length} exercise images...\n`);

  for (const exercise of exercises) {
    const imageUrl = await fetchImage(exercise);
    
    if (imageUrl) {
      const imageName = `${exercise.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      const imagePath = path.join(imagesDir, imageName);
      
      const success = await downloadImage(imageUrl, imagePath);
      if (success) {
        imageMapping[exercise] = `/exercise-images/${imageName}`;
        console.log(`✓ ${exercise}`);
      } else {
        console.log(`✗ ${exercise} (failed to save)`);
      }
    } else {
      console.log(`✗ ${exercise} (no image found)`);
    }
    
    completed++;
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Save mapping
  const mappingPath = path.join(__dirname, '..', 'client', 'public', 'exercise-images.json');
  fs.writeFileSync(mappingPath, JSON.stringify(imageMapping, null, 2));
  
  console.log(`\n✓ Saved ${Object.keys(imageMapping).length} images to ${mappingPath}`);
}

downloadAllImages();
