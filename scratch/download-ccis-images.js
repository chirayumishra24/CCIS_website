const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const imagesToDownload = [
  { name: 'logo.webp', url: 'https://ccischool.org/wp-content/uploads/2025/12/ccislogo.webp' },
  { name: 'ib-logo.png', url: 'https://ccischool.org/wp-content/uploads/2026/02/ib-logo-img.png' },
  { name: 'hero1.webp', url: 'https://ccischool.org/wp-content/uploads/2024/12/banner-img-ccis-scaled.webp' },
  { name: 'hero2.webp', url: 'https://ccischool.org/wp-content/uploads/2024/12/banner-img-ccis-1-scaled.webp' },
  { name: 'hero3.webp', url: 'https://ccischool.org/wp-content/uploads/2024/12/banner-img-ccis-2-scaled.webp' },
  { name: 'about-snapshot.webp', url: 'https://ccischool.org/wp-content/uploads/2026/03/Building-Confidence-and-Values.webp' },
  { name: 'achievements.webp', url: 'https://ccischool.org/wp-content/uploads/2026/03/Achievements-img.webp' },
  { name: 'director-aayush.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Mr.-Aayush-Singh-Rawat.jpeg' },
  { name: 'director-aarna.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Ms.-Aarna-Singh-Rawat.jpg' },
  { name: 'director-priyanshi.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Priyanka-Rawat.jpg' },
  { name: 'parent1.png', url: 'https://ccischool.org/wp-content/uploads/2026/03/Parent-review-1.png' },
  { name: 'parent2.png', url: 'https://ccischool.org/wp-content/uploads/2026/03/Parent-review-2.png' },
  { name: 'parent3.png', url: 'https://ccischool.org/wp-content/uploads/2026/03/Parent-review-3.png' },
  { name: 'parent4.png', url: 'https://ccischool.org/wp-content/uploads/2026/03/Parent-review-4.png' },
  { name: 'student1.webp', url: 'https://ccischool.org/wp-content/uploads/2026/03/Student-review-1.webp' },
  { name: 'student2.webp', url: 'https://ccischool.org/wp-content/uploads/2026/03/Student-review-2.webp' },
  { name: 'passion.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/passion-img.jpg' },
  { name: 'future.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/future-img.jpg' },
  { name: 'global.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/global.jpg' },
  { name: 'personalised.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Personalised.jpg' },
  { name: 'transform-1.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Transform-img-1.jpg' },
  { name: 'transform-2.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Transform-img-2.jpg' },
  { name: 'transform-3.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Transform-img-3.jpg' },
  { name: 'transform-4.jpg', url: 'https://ccischool.org/wp-content/uploads/2024/12/Transform-img-4.jpg' },
];

function downloadImage(img) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, img.name);
    const file = fs.createWriteStream(dest);
    
    https.get(img.url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed to download ${img.name}: Status code ${response.statusCode}`);
        file.close();
        fs.unlink(dest, () => {});
        resolve(false);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded: ${img.name}`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${img.name}:`, err.message);
      file.close();
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

async function run() {
  console.log("Starting downloads to " + targetDir);
  for (const img of imagesToDownload) {
    await downloadImage(img);
  }
  console.log("Downloads finished!");
}

run();
