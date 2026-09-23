const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const targetDir = 'app/(customer)/account';
const files = walk(targetDir);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    const regex1 = /fetch\(['"]\/api\/v1\/(.*?)['"]/g;
    if (regex1.test(content)) {
      content = content.replace(regex1, 'fetch(`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:8000\'}/api/v1/$1`');
      modified = true;
    }

    const regex2 = /fetch\(`\/api\/v1\/(.*?)`/g;
    if (regex2.test(content)) {
      content = content.replace(regex2, 'fetch(`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:8000\'}/api/v1/$1`');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content);
      console.log('Fixed ' + file);
    }
  }
});
