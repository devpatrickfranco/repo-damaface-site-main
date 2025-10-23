const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Diretório onde suas imagens estão (geralmente 'public/images')
// Ajuste se suas imagens estiverem em outro lugar dentro de /public
const publicDir = path.join(process.cwd(), 'public'); 
const allowedExtensions = ['.jpg', '.jpeg', '.png'];

async function findAndConvertImages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Entra recursivamente nos diretórios
      await findAndConvertImages(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      
      if (allowedExtensions.includes(ext)) {
        const webpPath = fullPath.replace(ext, '.webp');
        
        // Converte apenas se o .webp ainda não existir
        if (!fs.existsSync(webpPath)) {
          try {
            await sharp(fullPath)
              .webp({ quality: 80 }) // Ajuste a qualidade (1-100) se precisar
              .toFile(webpPath);
            console.log(`✅ Convertido: ${entry.name} -> ${path.basename(webpPath)}`);
          } catch (err) {
            console.error(`❌ Erro ao converter ${entry.name}:`, err);
          }
        }
      }
    }
  }
}

console.log('Iniciando conversão de imagens para .webp...');
findAndConvertImages(publicDir).then(() => {
  console.log('Conversão concluída.');
});