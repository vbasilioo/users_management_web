# Sistema de Gerenciamento de Usuários

Sistema web para gerenciamento de usuários com controle de permissões baseado em perfil, desenvolvido com React, Next.js, Redux, Tailwind CSS e CASL.

## Funcionalidades

- **Autenticação Segura**:
  - Sistema de login com JWT
  - Armazenamento seguro de tokens
  - Rotas protegidas

- **Gerenciamento de Usuários**:
  - Listagem de usuários (admin/gerente)
  - Cadastro de novos usuários (admin)
  - Edição de usuários (baseada em permissões)
  - Exclusão de usuários (apenas admin)

- **Controle de Acesso**:
  - Permissões baseadas em perfis (admin, gerente, usuário)
  - Interface adaptativa com base no nível de acesso do usuário
  - Tratamento de tentativas de acesso não autorizado

- **Perfis de Acesso**:
  - **Administrador**: Acesso total ao sistema, pode criar usuários e alterar permissões
  - **Gerente**: Visualiza todos os usuários, mas não pode alterar permissões
  - **Usuário**: Acessa apenas seu próprio perfil e funcionalidades básicas

## Tecnologias Utilizadas

- **Frontend**:
  - Next.js 15
  - React 19
  - Redux Toolkit (Gerenciamento de estado)
  - CASL (Controle de autorização)
  - React Hook Form + Zod (Validação de formulários)
  - Tailwind CSS + Shadcn/UI (Interface de usuário)
  - TypeScript

- **Integração**:
  - Axios (Requisições HTTP)
  - JWT para autenticação
  - Orval (Geração de tipos/interfaces a partir do OpenAPI)

## Controle de Permissões

O sistema implementa controle de acesso baseado em funções (RBAC) usando CASL:

- Apenas administradores podem criar novos usuários e alterar permissões
- Gerentes podem visualizar todos os usuários, mas só podem editar informações básicas
- Usuários comuns só podem visualizar e editar seu próprio perfil

## Como Iniciar

```bash
# Instalar dependências
npm install
# ou
pnpm install

# Iniciar servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o sistema.

## Executando Testes

O projeto utiliza Jest e React Testing Library para testes unitários.

```bash
# Instalar dependências de desenvolvimento
pnpm install 

# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch
```

### Testes Implementados

- **Componentes**
  - `RegisterForm`: testa o componente de formulário de registro, incluindo estados de carregamento, sucesso e validação de campos.

- **Hooks**
  - `useRegisterForm`: testa o hook responsável pela lógica de registro, incluindo inicialização, submissão de formulário e tratamento de erros.

- **Integração**
  - Fluxo completo de registro: testa a integração entre o formulário e os serviços, simulando o fluxo completo de registro de usuário.
