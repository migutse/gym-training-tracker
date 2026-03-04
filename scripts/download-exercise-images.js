const fs = require('fs');
const path = require('path');
const https = require('https');
const csv = require('csv-parse/sync');

// Read CSV file
const csvPath = path.join(__dirname, '..', '..', 'Desktop', 'workout_data (1).csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const records = csv.parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

// Extract unique exercise names
const exercises = new Set();
records.forEach(record => {
  if (record.exercise_title) {
    exercises.add(record.exercise_title);
  }
});

const exerciseList = Array.from(exercises).sort();
console.log(`\nFound ${exerciseList.length} unique exercises:\n`);
exerciseList.forEach(exercise => console.log(`  - ${exercise}`));

// Create images directory
const imagesDir = path.join(__dirname, '..', 'client', 'public', 'exercise-images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`\nCreated directory: ${imagesDir}`);
}

// Download images from Unsplash
const UNSPLASH_API_KEY = 'BxKxgKxSa2JKGjlXc6Mg_MdNH7FfZZXAYs9nfhTGNYo';
let imageMapping = {};
let downloadCount = 0;
let failCount = 0;

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function fetchAndDownloadImages() {
  console.log(`\nDownloading images for ${exerciseList.length} exercises...\n`);

  for (const exercise of exerciseList) {
    try {
      // Fetch from Unsplash
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(exercise)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const imageUrl = data.results[0].urls.regular;
          const imageName = `${exercise.toLowerCase().replace(/\s+/g, '-')}.jpg`;
          const imagePath = path.join(imagesDir, imageName);

          try {
            await downloadImage(imageUrl, imagePath);
            imageMapping[exercise] = `/exercise-images/${imageName}`;
            downloadCount++;
            console.log(`✓ Downloaded: ${exercise}`);
          } catch (err) {
            failCount++;
            console.log(`✗ Failed to download image for: ${exercise}`);
          }
        } else {
          failCount++;
          console.log(`✗ No image found for: ${exercise}`);
        }
      }
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      failCount++;
      console.log(`✗ Error fetching ${exercise}: ${error.message}`);
    }
  }

  // Save mapping file
  const mappingPath = path.join(__dirname, '..', 'client', 'public', 'exercise-images.json');
  fs.writeFileSync(mappingPath, JSON.stringify(imageMapping, null, 2));
  console.log(`\n✓ Saved mapping to: ${mappingPath}`);
  console.log(`\n Summary: Downloaded ${downloadCount}, Failed ${failCount}`);
}

fetchAndDownloadImages().catch(console.error);
