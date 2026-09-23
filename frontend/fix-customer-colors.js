const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const dir = path.join(__dirname, 'app', '(customer)');
const files = walk(dir);

let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Wait, the customer layout previously had bg-[#050505] for the sidebar and bg-[#f0f0f0] for the main area.
  // I already replaced the layout file entirely, so I don't need to replace those in layout.tsx.
  // But other pages might have hardcoded bg-[#fafafa].

  // Replace bg-white
  content = content.replace(/bg-white/g, 'bg-[var(--color-white)]');
  // Replace hover:bg-white
  content = content.replace(/hover:bg-white/g, 'hover:bg-[var(--color-white)]');
  // Replace ring-offset-white
  content = content.replace(/ring-offset-white/g, 'ring-offset-[var(--color-white)]');
  
  // Replace #fafafa
  content = content.replace(/bg-\[#fafafa\]/g, 'bg-[var(--color-background-subtle)]');
  content = content.replace(/hover:bg-\[#fafafa\]/g, 'hover:bg-[var(--color-background-subtle)]');
  
  // Replace #f5f5f5
  content = content.replace(/bg-\[#f5f5f5\]/g, 'bg-[var(--color-background-subtle)]');
  content = content.replace(/hover:bg-\[#f5f5f5\]/g, 'hover:bg-[var(--color-background-subtle)]');

  // Also replace #f0f0f0 if it exists
  content = content.replace(/bg-\[#f0f0f0\]/g, 'bg-[var(--color-background-subtle)]');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
    modifiedCount++;
  }
});

console.log('Total files modified: ' + modifiedCount);
