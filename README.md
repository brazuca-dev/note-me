## 🌱 Note.me | Gestão Inteligente de Notas

O Note.me é uma Prova de Conceito (PoC) focada em alta disponibilidade e performance. A aplicação resolve o dilema entre latência e persistência ao implementar uma estratégia de armazenamento híbrido: local (IndexedDB via Dexie) para acesso imediato e remoto (SQLite via Turso) para sincronização em nuvem.

![Imagem do Projeto](preview.png)

---

### **🎯 Por que este projeto existe?**

Como estudante de Licenciatura e Desenvolvedor, criei o Note.me para explorar como ferramentas modernas podem simplificar a experiência do usuário sem sacrificar a robustez técnica. O foco aqui foi:

- Developer Experience (DX): Uso do Bun e Biome para um ciclo de desenvolvimento ultra veloz.

- Segurança e Identidade: Autenticação gerenciada via Clerk.

- Persistência Eficiente: Validação com Zod no Backend (Hono) e Frontend.

---

### **🚀 Como executar o projeto**

1. Clone o repositório:

```bash
git clone https://github.com/brazuca-dev/note-me.git
```

2. Copie o arquivo `.env.example` para `.env` e configure suas chaves:

```bash
cp .env.example .env
```

4. Execute o projeto:

```bash
docker compose up --build
```

5. Abra seu navegador e vá para `http://localhost:5173`

---

### **⚒️ Stack tecnológica**

- 🎨 Frontend
  - ⚡ Vite - Ferramenta de construção WEB
  - ⚛️ React - Biblioteca de componentes reativos
  - 🎨 Tailwind CSS - Framework CSS focado em utilitários
  - 🧩 Shadcn UI - Componentes Tailwind CSS
  - 📝 Tiptap - Editor de texto React
  - 💾 Dexie - Biblioteca para acessar o IndexDB

- 🙍 Backend
  - 🔥 Hono - Framework para aplicações WEB
  - 🛡️ Zod - Validação de dados com esquemas
  - 👤 Clerk - Gerenciador de usuários
  - ☁️ Turso - SQLite em nuvem
  - 🌉 Nas duas pontas
  - 🧹 Biome - Formatador de código

- 🌉 Nas duas pontas
  - 🟦 TypeScript - Superset de JavaScript
  - 🫓 Bun - Runtime JavaScript
  - 🐳 Docker - Plataforma de containerização

---

### **💡 Diferenciais Técnicos**

- Offline-First: O uso do Dexie garante que o usuário nunca perca dados por instabilidade de rede.
- Edge Ready: Backend construído com Hono, preparado para rodar em arquiteturas de borda (Edge Computing).
- Containerização: Dockerfile otimizado para que o ambiente de dev seja idêntico ao de prod.

---

## **🥸 Autoria**

Projeto criado e mantido por🧑‍💻 [brazuca-dev](https://github.com/brazuca-dev) e sob licença [MIT](./LICENSE)
