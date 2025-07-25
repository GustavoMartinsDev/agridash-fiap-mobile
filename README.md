# 🌱 AgriDash Mobile

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.72-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-9.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Expo-49.0-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
</div>

<p align="center">
  <strong>Aplicativo móvel moderno para gestão agrícola inteligente</strong>
</p>

<p align="center">
  Sistema completo de controle de estoque, vendas e análise de dados para cooperativas e produtores rurais, desenvolvido com React Native e design system baseado em Atomic Design.
</p>

Vídeo explicativo: https://youtu.be/9F0-2f7MNPw

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Arquitetura](#-arquitetura)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **AgriDash Mobile** é uma aplicação móvel desenvolvida para gestão agrícola, oferecendo controle de estoque, registro de vendas e sistema de notificações. Construído com foco em clean code, arquitetura escalável e experiência do usuário moderna.

### 🎪 Principais Diferenciais

- **📱 Interface Moderna**: Design system consistente baseado em Atomic Design
- **🔄 Tempo Real**: Sincronização instantânea com Firebase Firestore
- **🏗️ Clean Architecture**: Código limpo e bem estruturado
- **🔐 Segurança**: Autenticação robusta com Firebase Auth
- **📴 Responsivo**: Interface adaptável para diferentes dispositivos

---

## ✨ Funcionalidades

### 🔐 **Autenticação & Segurança**

- Sistema completo de login e cadastro
- Autenticação com Firebase Authentication
- Validação em tempo real de formulários
- Gestão de sessões e estados de usuário

### � **Dashboard Principal**

- Interface organizada em abas (Vendas/Estoque)
- Navegação intuitiva entre funcionalidades
- Acesso rápido a notificações
- Layout responsivo e moderno

### 💰 **Gestão de Vendas**

- Registro rápido de vendas com formulário estruturado
- Validação automática de estoque disponível
- Histórico completo com tabela paginada
- Sistema de busca e filtros
- Ordenação por diferentes critérios

### 📦 **Controle de Estoque**

- Cadastro e atualização de produtos
- Gestão de quantidades em tempo real
- Organização por categorias
- Interface intuitiva para manipulação de dados

### 🔔 **Sistema de Notificações**

- Notificações em tempo real
- Modal dedicado para visualização
- Marcação individual e em lote como lidas
- Contador de notificações não lidas
- Interface moderna com ícones profissionais

---

## 🛠 Tecnologias

### **Frontend & Mobile**

- **React Native** `0.72` - Framework multiplataforma
- **Expo** `49.0` - Toolchain e runtime
- **TypeScript** `5.0` - Tipagem estática
- **NativeWind** `2.0` - Tailwind CSS para React Native

### **UI & Design**

- **React Native Paper** - Componentes Material Design
- **NativeWind** - Tailwind CSS para React Native
- **Atomic Design Pattern** - Arquitetura de componentes escalável
- **React Native Vector Icons** - Iconografia profissional
- **Custom Design System** - Tokens e componentes reutilizáveis

### **Backend & Database**

- **Firebase Authentication** - Sistema de autenticação
- **Cloud Firestore** - Banco de dados NoSQL
- **Firebase Storage** - Armazenamento de arquivos
- **Real-time Sync** - Sincronização em tempo real

### **DevOps & Quality**

- **TypeScript Strict Mode** - Tipagem rigorosa e type safety
- **Clean Code Principles** - Código limpo e bem documentado
- **Atomic Design** - Arquitetura de componentes escalável
- **Error Handling** - Tratamento robusto de erros
- **Firebase Rules** - Segurança no banco de dados

---

## 🏗 Estrutura do Projeto

```
📁 AgriDash-mobile/
├── 📁 components/              # Componentes organizados por Atomic Design
│   ├── 📁 atoms/              # Componentes básicos reutilizáveis
│   │   ├── 📄 FAlert/         # Sistema de alertas customizado
│   │   ├── 📄 FButton/        # Botões com variantes
│   │   ├── 📄 FContainer/     # Container flexível
│   │   ├── 📄 FInput/         # Inputs controlados
│   │   ├── 📄 FSelect/        # Componente de seleção
│   │   └── 📄 FText/          # Tipografia padronizada
│   ├── 📁 molecules/          # Combinações de atoms
│   │   ├── 📄 FHeader/        # Cabeçalho da aplicação
│   │   ├── 📄 FInputField/    # Campo de input completo
│   │   ├── 📄 FNotificationModal/ # Modal de notificações
│   │   ├── 📄 FProductInfo/   # Informações de produto
│   │   └── 📄 FSection/       # Seções de conteúdo
│   ├── 📁 organisms/          # Componentes complexos
│   │   ├── 📄 FChartContainer/ # Container de gráficos
│   │   ├── 📄 FLoginForm/     # Formulário de login
│   │   ├── 📄 FRegisterForm/  # Formulário de cadastro
│   │   ├── 📄 FSalesForm/     # Formulário de vendas
│   │   ├── 📄 FSalesList/     # Lista de vendas com tabela
│   │   └── 📄 FStockForm/     # Formulário de estoque
│   ├── 📁 templates/          # Templates de página
│   │   ├── 📄 AuthTemplate.tsx    # Layout de autenticação
│   │   └── 📄 DashboardTemplate.tsx # Layout do dashboard
│   └── 📄 index.ts            # Exports centralizados
├── 📁 pages/                  # Páginas da aplicação
│   ├── 📄 DashboardPage.tsx   # Página principal
│   ├── 📄 LoginPage.tsx       # Página de login
│   └── 📄 RegisterPage.tsx    # Página de cadastro
├── 📁 services/               # Serviços e APIs
│   ├── 📄 auth.ts            # Serviços de autenticação
│   ├── 📄 firebase.ts        # Configuração Firebase
│   └── 📄 notificacaoService.ts # Serviço de notificações
├── 📁 hooks/                  # Custom Hooks
│   └── 📄 useNotificacoes.ts  # Hook de notificações
├── 📁 context/                # Context API
│   └── 📄 AuthContext.tsx     # Contexto de autenticação
├── 📁 types/                  # Definições TypeScript
│   └── 📄 index.ts           # Interfaces e tipos
├── � config/                 # Configurações
│   └── �📄 firebase.ts        # Config Firebase
├── 📁 constants/              # Constantes da aplicação
├── 📁 assets/                 # Recursos estáticos
├── 📄 App.tsx                 # Componente raiz
├── 📄 global.css             # Estilos globais NativeWind
└── 📄 tailwind.config.js     # Configuração Tailwind
```

---

## 🚀 Instalação

### **Pré-requisitos**

Certifique-se de ter instalado:

- **Node.js** `≥ 16.0.0`
- **npm** `≥ 8.0.0` ou **yarn** `≥ 1.22.0`
- **Expo CLI** `≥ 6.0.0`
- **Git**

### **1. Clone o Repositório**

```bash
git clone https://github.com/GustavoMartinsDev/fiap-farm-mobile.git
cd fiap-farm-mobile
```

### **2. Instale as Dependências**

```bash
npm install
# ou
yarn install
```

### **3. Configure as Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **4. Execute o Projeto**

```bash
npx expo start
```

---

## ⚙️ Configuração

### **Firebase Setup**

1. **Crie um projeto no [Firebase Console](https://console.firebase.google.com/)**

2. **Configure a Authentication:**
   - Ative o método "Email/Senha"
   - Configure domínios autorizados

3. **Configure o Firestore:**

   ```javascript
   // Regras de segurança básicas
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **Estrutura das Collections:**
   ```
   📁 cooperados/          # Dados dos cooperados
   📁 produtos/            # Catálogo de produtos
   📁 estoque/             # Controle de estoque
   📁 vendas/              # Histórico de vendas
   � notificacoes/        # Sistema de notificações
   ```

### **Inicialização do Banco**

Execute o script de inicialização:

```bash
npx ts-node scripts/initDatabase.ts
```

---

## � Como Usar

### **1. Autenticação**

- Abra o aplicativo e faça login ou cadastre-se
- Use credenciais válidas ou o modo demo

### **2. Dashboard**

- Navegue entre as abas "Vendas" e "Estoque"
- Acesse notificações pelo ícone no topo
- Visualize dados organizados em interface limpa

### **3. Registrar Vendas**

- Selecione o produto do dropdown
- Insira quantidade e cooperado
- Confirme a venda (validação automática)

### **4. Gerenciar Estoque**

- Cadastre novos produtos
- Atualize quantidades disponíveis
- Organize produtos por categorias

### **5. Sistema de Notificações**

- Visualize notificações em tempo real
- Marque individualmente ou todas como lidas
- Acompanhe status de leitura

---

## 🏛 Arquitetura

### **Clean Code & Princípios SOLID**

O projeto segue rigorosamente os princípios de clean code:

- **Responsabilidade Única**: Cada componente tem uma função específica
- **Nomes Descritivos**: Funções e variáveis com nomenclatura clara
- **Funções Pequenas**: Máximo de 20 linhas por função
- **Sem Duplicação**: Reutilização através de componentes atômicos
- **Tratamento de Erros**: Error boundaries e validações robustas

### **Design System - Atomic Design**

```
🔸 Atoms (Básicos)
├── FButton, FInput, FText, FContainer
├── Responsáveis por funcionalidades únicas
└── Máxima reutilização

🔹 Molecules (Combinações)
├── FInputField, FHeader, FSection
├── Combinam 2-3 atoms
└── Funcionalidades específicas

🔷 Organisms (Complexos)
├── FLoginForm, FSalesForm, FSalesList
├── Lógica de negócio
└── Gerenciamento de estado local

🔶 Templates (Layout)
├── AuthTemplate, DashboardTemplate
├── Estrutura de páginas
└── Responsividade

🔴 Pages (Páginas)
├── LoginPage, DashboardPage
├── Integração com services
└── Roteamento
```

### **Fluxo de Dados & Estado**

```
User Input → Form Validation → Firebase Service → Real-time Updates → UI Update
```

### **Padrões de Desenvolvimento**

- **Custom Hooks** para lógica reutilizável (`useNotificacoes`, `useAuth`)
- **Context API** para estado global (AuthContext)
- **TypeScript Interfaces** para type safety
- **Firebase Real-time** para sincronização automática
- **Component Composition** para flexibilidade
- **Error First Approach** para robustez

---

## 🤝 Contribuição

### **Como Contribuir**

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### **Padrões de Código & Qualidade**

- Use **TypeScript** para todos os novos arquivos
- Siga **Atomic Design** para estrutura de componentes
- Implemente **Clean Code** principles
- Mantenha **consistência** com o design system existente
- **Valide entradas** do usuário sempre
- **Trate erros** de forma elegante com FAlert

### **Estrutura de Commits**

```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
refactor: refatoração de código
style: formatação e estilo
chore: tarefas de manutenção
```

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido com ❤️ por **Gustavo, Gabriel, Luiz e Lincoln** para a **FIAP**.

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/GustavoMartinsDev/fiap-farm-mobile/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/GustavoMartinsDev/fiap-farm-mobile/wiki)

---

<div align="center">
  <p><strong>🌱 AgriDash Mobile</strong></p>
  <p><em>Transformando a agricultura com tecnologia moderna</em></p>
</div>
