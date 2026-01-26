---
description: Nova arquitetura do back-end no modulo "Marketing"
---

# API Drive - Documentação para Front-End

## ⚠️ MUDANÇAS IMPORTANTES

### URLs Atualizadas

**ANTES:**
```
/marketing/drive/          → Arquivos
/marketing/folders/        → Pastas
/marketing/search/         → Busca global
```

**AGORA:**
```
/marketing/drive/files/    → Arquivos
/marketing/drive/folders/  → Pastas
/marketing/drive/search/   → Busca global
```

## 📋 Endpoints Disponíveis

### 1. Arquivos (Files)
**Base URL:** `/marketing/drive/files/`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/marketing/drive/files/` | Lista todos os arquivos |
| GET | `/marketing/drive/files/?folder=<id>` | Lista arquivos de uma pasta específica |
| GET | `/marketing/drive/files/?folder=null` | Lista arquivos na raiz (sem pasta) |
| GET | `/marketing/drive/files/<id>/` | Detalhes de um arquivo |
| POST | `/marketing/drive/files/` | Upload de arquivo |
| PUT/PATCH | `/marketing/drive/files/<id>/` | Atualizar arquivo |
| DELETE | `/marketing/drive/files/<id>/` | Deletar arquivo |

**Actions Especiais:**
- `POST /marketing/drive/files/<id>/mover/` - Mover arquivo para outra pasta
- `POST /marketing/drive/files/mover-lote/` - Mover múltiplos arquivos/pastas
- `POST /marketing/drive/files/upload-batch/` - Upload em lote com estrutura de pastas
- `POST /marketing/drive/files/download-zip/` - Download de múltiplos arquivos como ZIP
- `POST /marketing/drive/files/upload-chunk/` - Upload de chunk (arquivos grandes)
- `POST /marketing/drive/files/complete-upload/` - Finalizar upload em chunks
- `GET /marketing/drive/files/upload-status/<upload_id>/` - Status de upload em chunks

### 2. Pastas (Folders)
**Base URL:** `/marketing/drive/folders/`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/marketing/drive/folders/` | Lista todas as pastas |
| GET | `/marketing/drive/folders/?pasta_pai=<id>` | Lista subpastas de uma pasta |
| GET | `/marketing/drive/folders/?pasta_pai=null` | Lista pastas na raiz |
| GET | `/marketing/drive/folders/<id>/` | Detalhes de uma pasta |
| POST | `/marketing/drive/folders/` | Criar nova pasta |
| PUT/PATCH | `/marketing/drive/folders/<id>/` | Atualizar pasta |
| DELETE | `/marketing/drive/folders/<id>/` | Deletar pasta |

**Actions Especiais:**
- `GET /marketing/drive/folders/<id>/conteudo/` - Retorna conteúdo completo (breadcrumbs, subpastas, arquivos)
- `GET /marketing/drive/folders/root_content/` - Conteúdo da raiz do drive

### 3. Busca Global
**Base URL:** `/marketing/drive/search/`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/marketing/drive/search/?q=<termo>` | Busca em pastas e arquivos |

**Resposta:**
```json
{
  "folders": [...],  // Pastas que correspondem ao termo
  "files": [...]     // Arquivos que correspondem ao termo
}
```

## 📦 Exemplos de Uso

### Listar Conteúdo de uma Pasta
```javascript
// Conteúdo completo (recomendado)
GET /marketing/drive/folders/{folder_id}/conteudo/

// Resposta:
{
  "current_folder": {...},
  "breadcrumbs": [
    {"id": 1, "nome": "Marketing"},
    {"id": 5, "nome": "2025"},
    {"id": 12, "nome": "Janeiro"}
  ],
  "folders": [...],  // Subpastas
  "files": [...]     // Arquivos nesta pasta
}
```

### Conteúdo da Raiz
```javascript
GET /marketing/drive/folders/root_content/

// Resposta:
{
  "current_folder": null,
  "breadcrumbs": [],
  "folders": [...],  // Pastas na raiz
  "files": [...]     // Arquivos na raiz
}
```

### Upload de Arquivo
```javascript
// Upload simples
POST /marketing/drive/files/
Content-Type: multipart/form-data

FormData:
- arquivo: File
- nome: string
- folder: number (opcional, null para raiz)
- descricao: string (opcional)
```

### Mover Arquivo
```javascript
POST /marketing/drive/files/{file_id}/mover/
Content-Type: application/json

{
  "target_folder_id": 123  // ou null para raiz
}
```

### Mover em Lote
```javascript
POST /marketing/drive/files/mover-lote/
Content-Type: application/json

{
  "arquivo_ids": [1, 2, 3],
  "pasta_ids": [4, 5],
  "target_folder_id": 10  // ou null para raiz
}

// Resposta:
{
  "message": "Processamento concluído",
  "sucessos": [...],
  "erros": [...],
  "total_movidos": 5,
  "target_folder_id": 10
}
```

### Download ZIP
```javascript
POST /marketing/drive/files/download-zip/
Content-Type: application/json

{
  "folder_name": "Meus Arquivos",
  "files": [
    {
      "path": "/media/drive/arquivo1.pdf",
      "name": "arquivo1.pdf"
    },
    {
      "path": "/media/drive/arquivo2.jpg",
      "name": "arquivo2.jpg"
    }
  ]
}

// Resposta: Arquivo ZIP para download
```

### Upload em Chunks (Arquivos Grandes)
```javascript
// 1. Enviar cada chunk
POST /marketing/drive/files/upload-chunk/
Content-Type: multipart/form-data

FormData:
- upload_id: string (UUID, gerar no primeiro chunk)
- chunk_index: number (0-based)
- total_chunks: number
- chunk: File (pedaço do arquivo)
- filename: string
- folder_id: number (opcional)
- file_size: number (tamanho total)
- content_type: string

// Resposta:
{
  "message": "Chunk 1/10 recebido com sucesso",
  "upload_id": "uuid-gerado",
  "chunk_index": 0,
  "progress": 10.0,
  "is_complete": false,
  "missing_chunks": [1, 2, 3, ...]
}

// 2. Após todos os chunks, finalizar
POST /marketing/drive/files/complete-upload/
Content-Type: application/json

{
  "upload_id": "uuid-gerado"
}

// Resposta:
{
  "message": "Upload finalizado com sucesso",
  "file": {...}  // DriveFile criado
}

// 3. Verificar status (opcional, para retomada)
GET /marketing/drive/files/upload-status/{upload_id}/

// Resposta:
{
  "upload_id": "...",
  "filename": "video.mp4",
  "progress": 45.5,
  "is_complete": false,
  "missing_chunks": [5, 6, 7, 8, 9]
}
```

### Busca Global
```javascript
GET /marketing/drive/search/?q=contrato

// Resposta:
{
  "folders": [
    {
      "id": 5,
      "nome": "Contratos 2025",
      "caminho_cache": "/Marketing/Contratos 2025",
      "total_arquivos": 15,
      "total_subpastas": 3
    }
  ],
  "files": [
    {
      "id": 42,
      "nome": "contrato_servico.pdf",
      "caminho_virtual_cache": "/Marketing/Contratos 2025/contrato_servico.pdf",
      "tamanho": 1024000,
      "tipo": "application/pdf"
    }
  ]
}
```

## 🔑 Campos dos Modelos

### DriveFile
```typescript
interface DriveFile {
  id: number;
  nome: string;
  folder: number | null;  // ID da pasta ou null
  caminho_virtual_cache: string;  // Ex: "/Marketing/2025/arquivo.pdf"
  arquivo: string;  // URL do arquivo
  criador: number;  // ID do usuário
  tamanho: number;  // Em bytes
  tipo: string;  // MIME type
  descricao: string | null;
  ultima_modificacao: string;  // ISO datetime
  criado_em: string;  // ISO datetime
}
```

### Folder
```typescript
interface Folder {
  id: number;
  nome: string;
  pasta_pai: number | null;  // ID da pasta pai ou null
  caminho_cache: string;  // Ex: "/Marketing/2025/Janeiro"
  criador: number;  // ID do usuário
  total_arquivos: number;  // Annotated field
  total_subpastas: number;  // Annotated field
  ultima_modificacao: string;  // ISO datetime
  criado_em: string;  // ISO datetime
}
```

## ⚡ Filtros e Busca

### Arquivos
- `?folder=<id>` - Filtrar por pasta
- `?folder=null` - Apenas arquivos na raiz
- `?search=<termo>` - Busca por nome ou caminho

### Pastas
- `?pasta_pai=<id>` - Filtrar por pasta pai
- `?pasta_pai=null` - Apenas pastas na raiz
- `?search=<termo>` - Busca por nome ou caminho

## 🛡️ Permissões

Todas as rotas requerem:
- Usuário autenticado
- Role `SUPERADMIN` para métodos de escrita (POST, PUT, PATCH, DELETE)
- Qualquer usuário autenticado pode fazer GET (leitura)

## 📝 Notas Importantes

1. **Paths vs IDs:** Sempre use IDs para referenciar pastas e arquivos, não paths
2. **Cache:** Os campos `caminho_cache` e `caminho_virtual_cache` são atualizados automaticamente
3. **Movimentação:** Ao mover arquivos, o arquivo físico é movido automaticamente no servidor
4. **Chunks:** Tamanho recomendado de chunk: 5 MB (configurado em `CHUNK_SIZE`)
5. **Expiração:** Sessões de upload em chunks expiram em 24h

## 🔄 Migração do Front-End

### Checklist de Mudanças

- [ ] Atualizar todas as chamadas de `/marketing/drive/` para `/marketing/drive/files/`
- [ ] Atualizar todas as chamadas de `/marketing/folders/` para `/marketing/drive/folders/`
- [ ] Atualizar todas as chamadas de `/marketing/search/` para `/marketing/drive/search/`
- [ ] Testar upload de arquivos
- [ ] Testar movimentação de arquivos
- [ ] Testar download ZIP
- [ ] Testar busca global

