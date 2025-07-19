# 🌱 Farm Fiap - Aplicativo de Controle de Estoque

## 📋 Sobre o Projeto

O **Farm Fiap** é um aplicativo mobile desenvolvido para controle de estoque agrícola, oferecendo uma interface moderna e intuitiva para gestão de produtos, vendas e visualização de dados através de gráficos interativos.

## 📱 Funcionalidades

- ✅ **Login/Cadastro** com validação em tempo real
- 📊 **Dashboard** com gráficos interativos
- 💰 **Registro de vendas**
- 📈 **Visualização de dados** (vendas por mês, estoque, categorias)
- 🎨 **Design system** consistente
- 📱 **Interface responsiva**

## 🛠️ Tecnologias

- **React Native** + **Expo**
- **TypeScript** para type safety
- **NativeWind** para estilização (Tailwind CSS)
- **React Native Gifted Charts** para gráficos
- **Atomic Design** para arquitetura de componentes

## 🏗️ Estrutura do Projeto

```
📁 Farm Fiap/
├── 📁 components/
│   ├── 📁 atoms/          # Componentes básicos (FButton, FInput, FText, FContainer)
│   ├── 📁 molecules/      # Combinações simples (FInputField, FHeader, FSection)
│   ├── 📁 organisms/      # Componentes complexos (FLoginForm, FSalesForm)
│   ├── 📁 templates/      # Layouts de página (AuthTemplate, DashboardTemplate)
│   └── 📄 index.ts        # Exports centralizados
├── 📁 pages/              # Páginas da aplicação
│   ├── 📄 LoginPage.tsx
│   ├── 📄 RegisterPage.tsx
│   └── 📄 DashboardPage.tsx
├── 📁 types/              # Tipos TypeScript
│   └── 📄 index.ts
├── 📄 App.tsx             # Componente principal
└── 📄 global.css          # Estilos globais NativeWind
```

## ⚛️ Componentes Atômicos

### 🔘 FButton

```tsx
<FButton variant="primary" size="large" fullWidth loading={isLoading}>
  Entrar
</FButton>
```

### 📝 FInput

```tsx
<FInput type="email" state="error" placeholder="E-mail" />
```

### 🔤 FText

```tsx
<FText variant="title" color="primary">
  Farm Fiap
</FText>
```

### 📦 FContainer

```tsx
<FContainer fullScreen centered background="primary" padding="large">
  {children}
</FContainer>
```

## 🧬 Moléculas

### 📋 FInputField

```tsx
<FInputField
  label="E-mail"
  type="email"
  error="Digite um e-mail válido"
  required
/>
```

### 🏷️ FHeader

```tsx
<FHeader
  title="Dashboard"
  subtitle="Controle de Estoque"
  rightComponent={<FButton>Logout</FButton>}
/>
```

## 🦠 Organismos

### 🔐 FLoginForm

- Validação em tempo real
- Estados de loading
- Gestão completa do formulário

### 💰 FSalesForm

- Registro de vendas
- Validação de campos
- Reset automático

### 📊 FSalesList

- Lista de vendas históricas
- Estados vazios tratados

## 🎨 Sistema de Design

### Cores Personalizadas

```css
farm-green-50   /* #e6f2d6 - Fundo claro */
farm-green-800  /* #4e7934 - Verde principal */
farm-amber-400  /* #b2a177 - Âmbar */
farm-amber-700  /* #7c6f57 - Âmbar escuro */
farm-red-600    /* #c0392b - Vermelho erro */
```

### Tipografia

- **Title**: 32px, bold
- **Subtitle**: 18px
- **Body**: 16px (padrão)
- **Caption**: 14px

### Espaçamento

- **Padding**: none, small (8px), medium (16px), large (24px)
- **Margins**: 8px, 16px, 32px intervals

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar no desenvolvimento
expo start

# Executar no Android
expo start --android

# Executar no iOS
expo start --ios
```

## 📊 Gráficos e Dashboards

O app inclui três tipos de visualizações:

1. **📈 Gráfico de Linha**: Vendas por mês
2. **📊 Gráfico de Barras**: Estoque atual
3. **🥧 Gráfico de Pizza**: Categorias de produtos

## ✨ Principais Características

### 🎨 Design System Consistente

- Componentes reutilizáveis organizados por hierarquia
- Sistema de cores personalizado para agricultura
- Tipografia responsiva e acessível

### � Autenticação Completa

- Sistema de login e cadastro
- Validação em tempo real
- Gestão de estados de loading

### � Visualização de Dados

- Gráficos interativos para vendas mensais
- Controle de estoque visual
- Categorização de produtos

### � Gestão de Vendas

- Registro rápido de vendas
- Histórico completo
- Validação de formulários

## 🔮 Funcionalidades Futuras

- [ ] **Temas**: Modo escuro/claro
- [ ] **Notificações**: Alertas de estoque baixo
- [ ] **Relatórios**: Exportação de dados
- [ ] **Multi-usuário**: Diferentes perfis de acesso
- [ ] **Sincronização**: Backup na nuvem
- [ ] **Offline**: Funcionamento sem internet

## 📚 Tecnologias Utilizadas

- **React Native** + **Expo** - Framework mobile multiplataforma
- **TypeScript** - Tipagem estática para maior segurança
- **NativeWind** - Estilização com Tailwind CSS
- **React Native Gifted Charts** - Gráficos interativos
- **Atomic Design** - Arquitetura de componentes escalável

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🌱 Farm Fiap** - Transformando a gestão agrícola com tecnologia moderna e design atômico!
