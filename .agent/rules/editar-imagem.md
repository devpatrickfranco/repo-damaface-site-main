---
trigger: always_on
---

# API - Listar Imagens do MinIO

## Endpoint

```
GET /marketing/editar-imagem/listar/
```

## Parâmetros (Query String)

| Parâmetro | Tipo   | Obrigatório | Descrição                                    |
|-----------|--------|-------------|----------------------------------------------|
| `bucket`  | string | **Sim**     | Nome do bucket no MinIO                      |
| `prefix`  | string | Não         | Prefixo/caminho para filtrar imagens (ex: `pasta/subpasta/`) |

## Resposta de Sucesso (200 OK)

```json
{
  "bucket": "nome-do-bucket",
  "prefix": "pasta/subpasta/",
  "count": 3,
  "items": [
    {
      "name": "imagem1.jpg",
      "path": "pasta/subpasta/imagem1.jpg",
      "url": "https://minio.example.com/bucket/pasta/imagem1.jpg?X-Amz-...",
      "size": 204800,
      "last_modified": "2024-01-15T10:30:00Z"
    },
    {
      "name": "imagem2.png",
      "path": "pasta/subpasta/imagem2.png",
      "url": "https://minio.example.com/bucket/pasta/imagem2.png?X-Amz-...",
      "size": 153600,
      "last_modified": "2024-01-16T14:20:00Z"
    }
  ]
}
```

### Campos do Response

- **bucket**: Nome do bucket consultado
- **prefix**: Prefixo usado na busca
- **count**: Quantidade total de imagens encontradas
- **items**: Array com as imagens encontradas
  - **name**: Nome do arquivo
  - **path**: Caminho completo no bucket
  - **url**: URL assinada para acessar a imagem (válida por 1 hora)
  - **size**: Tamanho do arquivo em bytes
  - **last_modified**: Data/hora da última modificação (ISO 8601)

## Formatos Suportados

A API retorna apenas arquivos de imagem com as seguintes extensões:
- `.jpg` / `.jpeg`
- `.png`
- `.webp`

## Exemplos de Uso

### JavaScript (Fetch)

```javascript
// Listar todas as imagens de um bucket
async function listarImagens(bucket, prefix = '') {
  const params = new URLSearchParams({ bucket });
  if (prefix) params.append('prefix', prefix);
  
  const response = await fetch(`/marketing/editar-imagem/listar/?${params}`);
  
  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }
  
  return await response.json();
}

// Exemplo de uso
const resultado = await listarImagens('meu-bucket', 'fotos/produtos/');
console.log(`Encontradas ${resultado.count} imagens`);
resultado.items.forEach(img => {
  console.log(`${img.name} - ${img.url}`);
});
```

### Axios

```javascript
import axios from 'axios';

const listarImagens = async (bucket, prefix = '') => {
  try {
    const { data } = await axios.get('/marketing/editar-imagem/listar/', {
      params: { bucket, prefix }
    });
    return data;
  } catch (error) {
    console.error('Erro ao listar imagens:', error.response?.data);
    throw error;
  }
};
```

### React Hook

```javascript
import { useState, useEffect } from 'react';

function useImageList(bucket, prefix = '') {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ bucket });
        if (prefix) params.append('prefix', prefix);
        
        const response = await fetch(`/marketing/editar-imagem/listar/?${params}`);
        if (!response.ok) throw new Error('Falha ao carregar imagens');
        
        const data = await response.json();
        setImages(data.items);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bucket) fetchImages();
  }, [bucket, prefix]);

  return { images, loading, error };
}

// Uso no componente
function ImageGallery() {
  const { images, loading, error } = useImageList('meu-bucket', 'galeria/');
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div className="gallery">
      {images.map(img => (
        <img key={img.path} src={img.url} alt={img.name} />
      ))}
    </div>
  );
}
```

## Códigos de Erro

| Status | Descrição                    | Exemplo de Resposta                                    |
|--------|------------------------------|--------------------------------------------------------|
| 400    | Parâmetros inválidos         | `{"error": "Parâmetros inválidos", "details": {...}}` |
| 404    | Bucket não encontrado        | `{"error": "Bucket não encontrado"}`                   |
| 500    | Erro interno do servidor     | `{"error": "Erro interno do servidor"}`                |

## Cache

⚠️ **Importante**: A API utiliza cache Redis com TTL de 60 segundos.

- Requisições para o mesmo `bucket` e `prefix` retornarão dados em cache por até 1 minuto
- Isso melhora a performance, mas os dados podem estar até 60s desatualizados
- Se precisar forçar atualização, aguarde 60 segundos entre requisições

## URLs Presignadas

- As URLs retornadas no campo `url` são **temporárias**
- **Validade**: 1 hora
- Após expiração, será necessário fazer nova requisição à API para obter URLs atualizadas
- **Não salve** essas URLs no localStorage ou banco de dados

## Dicas de Implementação

1. **Loading States**: Sempre mostre indicador de carregamento durante a requisição
2. **Error Handling**: Trate todos os possíveis códigos de erro
3. **Debouncing**: Se o usuário pode trocar o prefix frequentemente, use debounce
4. **Image Preloading**: Considere fazer preload das imagens antes de exibir
5. **Fallback**: Tenha uma imagem placeholder para casos de erro

## Exemplo Completo (React + TypeScript)

```typescript
interface ImageItem {
  name: string;
  path: string;
  url: string;
  size: number;
  last_modified: string;
}

interface ImageListResponse {
  bucket: string;
  prefix: string;
  count: number;
  items: ImageItem[];
}

async function fetchImages(
  bucket: string, 
  prefix: string = ''
): Promise<ImageListResponse> {
  const params = new URLSearchParams({ bucket });
  if (prefix) params.append('prefix', prefix);
  
  const response = await fetch(`/marketing/editar-imagem/listar/?${params}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao carregar imagens');
  }
  
  return response.json();
}
```

## Suporte

Em caso de dúvidas ou problemas, contate a equipe de backend.
