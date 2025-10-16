// Usamos require porque este é um script Node.js simples
const fs = require("fs");
const path = require("path");
const lucideIcons = require("lucide-react");

console.log("Iniciando a geração da lista de ícones...");

// Filtra as exportações para pegar apenas os componentes de ícone
// Eles são objetos (React components), então excluímos funções e valores primitivos.
// Também excluímos 'default' e 'icons' que são exportações de utilidade.
const iconNames = Object.keys(lucideIcons).filter(
  (key) => typeof lucideIcons[key] === "object" && key !== "default" && key !== "icons"
);

// Define o caminho de saída para o arquivo JSON
const outputPath = path.join(process.cwd(), "data", "lucide-icon-names.json");

// Garante que o diretório 'src/data' exista
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Escreve a lista de nomes no arquivo JSON com formatação legível
fs.writeFileSync(outputPath, JSON.stringify(iconNames, null, 2));

console.log(`✅ Sucesso! ${iconNames.length} nomes de ícones foram salvos em: ${outputPath}`);