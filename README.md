# Sistema de Gerenciamento de Usuários

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)
![CASL](https://img.shields.io/badge/CASL-Authorization-green)

Sistema web robusto para gerenciamento de usuários com controle de permissões baseado em perfil.

[Funcionalidades](#funcionalidades) •
[Tecnologias](#tecnologias-utilizadas) •
[Instalação](#instalação) •
[Uso](#como-usar) •
[Testes](#testes) •
[Estrutura](#estrutura-do-projeto)

</div>

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- Sistema de login com JWT (JSON Web Tokens)
- Armazenamento seguro de tokens com httpOnly cookies
- Proteção contra CSRF
- Rotas protegidas com middleware de autenticação
- Refresh token automático

### 👥 Gerenciamento de Usuários
- **Listagem Dinâmica**:
  - Filtros por nome, papel e data
  - Ordenação por múltiplos campos
  - Paginação eficiente
- **Operações CRUD**:
  - Criação de usuários com validação em tempo real
  - Edição com controle granular de permissões
  - Exclusão com confirmação de segurança

### 🛡️ Controle de Acesso (RBAC)
- **Níveis de Acesso**:
  | Perfil | Permissões |
  |--------|------------|
  | Admin | Acesso total ao sistema |
  | Gerente | Visualização e edição limitada |
  | Usuário | Acesso ao próprio perfil |

- **Recursos por Perfil**:
  ```typescript
  const permissions = {
    admin: ['create:user', 'update:any', 'delete:any'],
    manager: ['read:any', 'update:own'],
    user: ['read:own', 'update:own']
  };
  ```

## 🛠️ Tecnologias Utilizadas

### Frontend Core
- **Next.js 15** - Framework React com SSR
- **React 19** - Biblioteca UI com Hooks
- **TypeScript** - Tipagem estática
- **Redux Toolkit** - Gerenciamento de estado
- **TanStack Query** - Gerenciamento de cache e estado do servidor

### UI/UX
- **Tailwind CSS** - Estilização utilitária
- **Shadcn/UI** - Componentes reutilizáveis
- **Sonner** - Notificações elegantes
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### Qualidade e Testes
- **Jest** - Framework de testes
- **Testing Library** - Testes de componentes
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/vbasilioo/management-users-web.git
   cd management-users-web
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   Edite `.env.local` com suas configurações

4. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm dev
   ```

## 💻 Como Usar

### Desenvolvimento Local
```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Iniciar build de produção
pnpm start
```

### Scripts Disponíveis
- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm start` - Inicia build de produção
- `pnpm lint` - Executa verificação de linting
- `pnpm test` - Executa testes unitários
- `pnpm test:watch` - Executa testes em modo watch
- `pnpm generate:api` - Gera tipos a partir do OpenAPI

## 🧪 Testes

O projeto utiliza Jest e React Testing Library para testes unitários e de integração.

```bash
# Executar todos os testes
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar testes em modo watch
pnpm test:watch
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas e páginas Next.js
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn)
│   ├── auth/             # Componentes de autenticação
│   └── dashboard/        # Componentes do dashboard
├── lib/                  # Utilitários e configurações
│   ├── redux/           # Store e slices Redux
│   └── casl/            # Configuração de autorização
├── hooks/               # Hooks customizados
├── schemas/             # Schemas de validação (Zod)
└── styles/             # Estilos globais
```

## 🔒 Segurança

- Tokens JWT armazenados em cookies httpOnly
- Proteção contra CSRF
- Sanitização de inputs
- Rate limiting nas APIs
- Headers de segurança configurados