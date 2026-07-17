const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\534c3c98-c5c7-4b2d-8f5a-e3a1503f7014\\.system_generated\\steps\\317\\content.md';
if (!fs.existsSync(contentPath)) {
  console.log("File not found!");
  process.exit(1);
}

const content = fs.readFileSync(contentPath, 'utf8');

// regex for src="url" or url('url') or href="url"
const regex = /(https?:\/\/[^\s'"\(\)]+?\.(?:png|jpg|jpeg|webp|svg|gif))/gi;
const matches = content.match(regex) || [];

// unique matches
const uniqueMatches = Array.from(new Set(matches));

console.log("Found " + uniqueMatches.length + " image URLs:");
uniqueMatches.forEach((url, i) => {
  console.log(`${i+1}: ${url}`);
});
