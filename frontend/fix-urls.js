const fs = require('fs');

const apiUrlStr = "  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');\n";

const files = [
  'app/(customer)/account/orders/page.tsx',
  'app/(customer)/account/requests/[id]/page.tsx',
  'app/(customer)/account/orders/[id]/page.tsx',
  'app/(customer)/account/quotes/page.tsx',
  'app/(customer)/account/measurements/[id]/page.tsx',
  'app/(customer)/account/quotes/[id]/page.tsx',
  'app/(customer)/account/conversations/[id]/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Replace const x = await fetch(`/api/v1/
  const regex = /([ \t]*)const (\w+) = await fetch\(`\/api\/v1\//g;
  content = content.replace(regex, (match, spaces, varName) => {
    modified = true;
    return spaces + apiUrlStr.trimStart() + spaces + `const ${varName} = await fetch(\`\${apiUrl}/api/v1/`;
  });
  
  // Replace fetch(`/api/v1/ (for the promise.all calls, etc)
  const regex2 = /([ \t]*)fetch\(`\/api\/v1\//g;
  content = content.replace(regex2, (match, spaces) => {
    modified = true;
    return spaces + `fetch(\`\${apiUrl}/api/v1/`;
  });

  if (modified) {
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
});
