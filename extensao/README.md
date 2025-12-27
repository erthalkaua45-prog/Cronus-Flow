# Cronus Flow

Mentor de vendas em tempo real para WhatsApp Web, powered by AI.

## Estrutura do Projeto

- `frontend/`: Extensão do Chrome
- `backend/`: API Node.js com TypeScript

## Instalação

1. Clone o repositório
2. Instale as dependências: `npm run install-all`
3. Configure as variáveis de ambiente no backend
4. Execute o backend: `cd backend && npm run dev`
5. Carregue a extensão no Chrome

## Desenvolvimento

- Frontend: Modifique os arquivos na pasta `frontend/`
- Backend: Modifique os arquivos na pasta `backend/src/`

## Docker

Para executar o backend em Docker:

```bash
cd backend
docker build -t cronus-flow-backend .
docker run -p 3000:3000 cronus-flow-backend
```