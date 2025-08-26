# Reset da Barriga - Quiz Application

Uma aplicação de quiz interativa para o protocolo Reset da Barriga, construída com React, TypeScript e Express.

## 🚀 Deploy no Vercel

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Repositório Git (GitHub, GitLab, ou Bitbucket)
3. Banco de dados configurado (se aplicável)

### Passos para Deploy

1. **Conecte seu repositório ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório

2. **Configure as variáveis de ambiente:**
   - No dashboard do Vercel, vá para Settings > Environment Variables
   - Adicione as seguintes variáveis:
     ```
     DATABASE_URL=sua_url_do_banco_de_dados
     NODE_ENV=production
     ```

3. **Deploy automático:**
   - O Vercel detectará automaticamente as configurações do `vercel.json`
   - O build será executado automaticamente
   - A aplicação estará disponível na URL fornecida pelo Vercel

### Configurações Incluídas

- ✅ **Vite otimizado** para produção
- ✅ **Terser** para minificação
- ✅ **Code splitting** automático
- ✅ **Cache headers** otimizados
- ✅ **SPA routing** configurado
- ✅ **API routes** mapeadas
- ✅ **Build process** testado

### Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento local
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run check    # Verificação de tipos
```

### Estrutura do Projeto

```
├── client/          # Frontend React
├── server/          # Backend Express
├── dist/            # Build de produção
├── vercel.json      # Configuração do Vercel
└── vite.config.ts   # Configuração do Vite
```

## 📱 Funcionalidades

- Quiz interativo com múltiplas páginas
- Carrossel de depoimentos
- Cronômetro de oferta
- Design responsivo
- Transições otimizadas
- Integração com planos de compra

## 🛠️ Tecnologias

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Express.js, Node.js
- **UI Components:** Radix UI
- **Deploy:** Vercel
- **Database:** Drizzle ORM (configurável)

---

**Nota:** Esta aplicação está 100% otimizada e pronta para deploy no Vercel. Todas as configurações necessárias já estão incluídas.