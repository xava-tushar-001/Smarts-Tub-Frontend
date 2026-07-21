const fs = require('fs');
const path = require('path');
const file = path.join('dist/assets', fs.readdirSync('dist/assets').find((f) => f.endsWith('.css')));
const css = fs.readFileSync(file, 'utf8');

const needles = ['.md\\:w-auto{', '.md\\:w-64{', '.md\\:w-72{', '.md\\:w-\\[4.75rem\\]{'];
for (const n of needles) {
  console.log(n, '->', css.indexOf(n));
}
