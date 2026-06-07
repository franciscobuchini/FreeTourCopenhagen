import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDataPath = path.join(__dirname, '../src/data/blogData.js');

try {
  let content = fs.readFileSync(blogDataPath, 'utf8');
  const timestamp = new Date().toISOString();

  // Check if the comment already exists
  if (content.includes('// LAST_SEO_UPDATE:')) {
    content = content.replace(/\/\/ LAST_SEO_UPDATE: .*/, `// LAST_SEO_UPDATE: ${timestamp}`);
  } else {
    // Add the comment at the end of the file
    content += `\n// LAST_SEO_UPDATE: ${timestamp}\n`;
  }

  // To ensure the file hash actually changes and triggers a meaningful diff, 
  // we will toggle a space in one of the texts, simulating a real content edit for Googlebot.
  if (content.includes("', // seo-toggled")) {
    content = content.replace("', // seo-toggled", "' // seo-toggled");
  } else if (content.includes("' // seo-toggled")) {
    content = content.replace("' // seo-toggled", "', // seo-toggled");
  } else {
    // First time running, add the toggle to the first excerpt
    content = content.replace(/excerpt: '(.*?)',/, "excerpt: '$1 ', // seo-toggled");
  }

  fs.writeFileSync(blogDataPath, content);
  console.log(`SEO update applied successfully. Timestamp: ${timestamp}`);
} catch (error) {
  console.error('Error updating blogData.js:', error);
  process.exit(1);
}
