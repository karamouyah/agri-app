import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.join(__dirname, '../shared/controlled-product-catalog.json');
const productsDir = path.join(__dirname, '../src/assets/products');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// Remove old SVG placeholders
const oldFiles = fs.readdirSync(productsDir);
for (const file of oldFiles) {
  if (file.endsWith('.svg') || file.endsWith('.jpg')) {
    fs.unlinkSync(path.join(productsDir, file));
  }
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const names = catalog.map(p => p.name);
names.push('default');

const sanitize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const run = async () => {
  console.log(`Downloading ${names.length} images...`);
  
  const importsMap = [];
  const exportMap = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const key = sanitize(name);
    const filename = `${key}.jpg`;
    const filepath = path.join(productsDir, filename);
    const keyword = name === 'default' ? 'vegetables,farm' : name.replace(/ /g, '') + ',food';
    const url = `https://loremflickr.com/500/500/${encodeURIComponent(keyword)}/all`;
    
    try {
      console.log(`Fetching ${key} from ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      
      const varName = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) + 'Img';
      importsMap.push(`import ${varName} from '../assets/products/${filename}';`);
      exportMap.push(`  '${key}': ${varName},`);
      
      // Delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));

    } catch (e) {
      console.error(`Failed ${name}: ${e.message}`);
    }
  }

  // Generate the productImages.js map file in src/utils/
  const utilsDir = path.join(__dirname, '../src/utils');
  if (!fs.existsSync(utilsDir)) fs.mkdirSync(utilsDir, { recursive: true });
  
  const jsContent = `// Auto-generated mapping of real product images\n\n${importsMap.join('\n')}\n\nconst productImages = {\n${exportMap.join('\n')}\n};\n\nexport const getProductImage = (productName) => {\n  if (!productName) return productImages.default;\n  const key = productName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');\n  return productImages[key] || productImages.default;\n};\n\nexport default productImages;\n`;

  fs.writeFileSync(path.join(utilsDir, 'productImages.js'), jsContent);
  console.log('✅ Generated src/utils/productImages.js with real images.');
};

run().catch(console.error);
