---
description: Nova arquitetura do back-end no modulo "Marketing"
---

ANTES	AGORA
GET /marketing/drive/	GET /marketing/drive/files/
POST /marketing/drive/	POST /marketing/drive/files/
GET /marketing/drive/{id}/	GET /marketing/drive/files/{id}/
PUT /marketing/drive/{id}/	PUT /marketing/drive/files/{id}/
PATCH /marketing/drive/{id}/	PATCH /marketing/drive/files/{id}/
DELETE /marketing/drive/{id}/	DELETE /marketing/drive/files/{id}/
POST /marketing/drive/{id}/mover/	POST /marketing/drive/files/{id}/mover/
POST /marketing/drive/mover-lote/	POST /marketing/drive/files/mover-lote/
POST /marketing/drive/upload-batch/	POST /marketing/drive/files/upload-batch/
POST /marketing/drive/download-zip/	POST /marketing/drive/files/download-zip/
POST /marketing/drive/upload-chunk/	POST /marketing/drive/files/upload-chunk/
POST /marketing/drive/complete-upload/	POST /marketing/drive/files/complete-upload/
GET /marketing/drive/upload-status/{id}/	GET /marketing/drive/files/upload-status/{id}/
Pastas (FolderViewSet)
ANTES	AGORA
GET /marketing/folders/	GET /marketing/drive/folders/
POST /marketing/folders/	POST /marketing/drive/folders/
GET /marketing/folders/{id}/	GET /marketing/drive/folders/{id}/
PUT /marketing/folders/{id}/	PUT /marketing/drive/folders/{id}/
PATCH /marketing/folders/{id}/	PATCH /marketing/drive/folders/{id}/
DELETE /marketing/folders/{id}/	DELETE /marketing/drive/folders/{id}/
GET /marketing/folders/{id}/conteudo/	GET /marketing/drive/folders/{id}/conteudo/
GET /marketing/folders/root_content/	GET /marketing/drive/folders/root_content/
Busca Global
ANTES	AGORA
GET /marketing/search/	GET /marketing/drive/search/
🔁 Resumo da Mudança
Padrão:

/marketing/drive/ → /marketing/drive/files/
/marketing/folders/ → /marketing/drive/folders/
/marketing/search/ → /marketing/drive/search/
Total: 23 endpoints mudaram! 🎯