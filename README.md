## **🌱 Note.me**

Boas vindas ao projeto **Note.me**! Um POC (Proof of Concept) que permite gerenciar anotações de forma simples e intuitiva. Esta aplicação possui armazenamento local, no navegador, através do [Dexie](https://dexie.org/), e armazenamento remoto, através do [Turso](https://turso.tech/).

---

![Imagem do Projeto](preview.png)

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

## **⚒️ Tecnologias utilizadas**

- 🎨 Frontend
  - ⚡ [Vite](https://vitejs.dev/) - Ferramenta de construção WEB
  - ⚛️ [React](https://reactjs.org/) - Biblioteca de componentes reativos
  - 🎨 [Tailwind CSS](https://tailwindcss.com/) - Framework CSS focado em utilitários
  - 🧩 [Shadcn UI](https://shadcn.com/) - Componentes Tailwind CSS
  - 📝 [Tiptap](https://tiptap.dev/) - Editor de texto React
  - 💾 [Dexie](https://dexie.org/) - Biblioteca para acessar o IndexDB

---

- 🙍 Backend
  - 🔥 [Hono](https://hono.dev/) - Framework para aplicações WEB
  - 🛡️ [Zod](https://zod.dev/) - Validação de dados com esquemas
  - 👤 [Clerk](https://clerk.com/) - Gerenciador de usuários
  - ☁️ [Turso](https://turso.tech/) - SQLite em nuvem

---

- 🌉 Nas duas pontas
  - 🧹 [Biome](https://biomejs.dev/) - Formatador de código
  - 🟦 [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript
  - 🫓 [Bun](https://bun.com/) - Runtime JavaScript
  - 🐳 [Docker](https://www.docker.com/) - Plataforma de containerização

---

## **🥸 Creator**

Projeto criado e mantido por🧑‍💻 [BrazucaDeveloper](https://github.com/BrazucaDeveloper) e sob licença [MIT](./LICENSE)
