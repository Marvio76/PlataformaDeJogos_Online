# 🕹️ Marvio-web.app - Plataforma de Jogos Educacionais

## 📖 Descrição do Projeto

O ** Marvio-web.app** é uma plataforma de jogos educativos interativos, criada para tornar o aprendizado mais dinâmico, envolvente e acessível. A plataforma oferece diversos jogos, como Memória, Associação e Quiz, que são voltados para estudantes, professores e qualquer pessoa interessada em aprender de forma lúdica.

Dentro da plataforma, os usuários podem:

- **Criar jogos educativos personalizados**, definindo perguntas, respostas e conteúdos relevantes.
- **Compartilhar jogos** com outros usuários por meio de códigos de acesso exclusivos.
- **Jogar e interagir** com os jogos disponíveis, acumulando pontos e acompanhando seu desempenho.
- **Visualizar resultados e estatísticas** das partidas, permitindo o acompanhamento do progresso individual.
- **Gerenciar conteúdos educativos** que alimentam os jogos, como termos e definições, facilitando a atualização e organização do
material.
- **Autenticação segura** com cadastro e login, garantindo privacidade e personalização da experiência.

A plataforma foi desenvolvida com foco na usabilidade, acessibilidade e escalabilidade, permitindo que escolas e educadores integrem facilmente ferramentas educacionais digitais no seu cotidiano.




---

## 🛢️ Informações sobre Banco de Dados

Este projeto utiliza **MongoDB Atlas**, uma solução de banco de dados NoSQL em nuvem, para armazenar dados relacionados a usuários, jogos, conteúdos, resultados e compartilhamentos.

### Estrutura das Coleções

- **usuarios**: Armazena dados dos usuários cadastrados, como nome, email, senha criptografada.
- **games**: Contém os jogos criados pelos usuários, com informações como título, tipo e conteúdo do jogo.
- **content**: Guarda os conteúdos educativos usados nos jogos (termos, definições etc.).
- **results**: Registra os resultados das partidas jogadas pelos usuários, incluindo pontuações e tempo.
- **sharedGames**: Armazena os dados dos jogos compartilhados, com códigos e links de acesso.


---
## 🚀 Tecnologias Utilizadas

### 🔧 Back-end
- Node.js
- Express.js
- MongoDB (via MongoDB Atlas ou local)
- Mongoose
- Dotenv

### 🎨 Front-end
- React.js
- Vite
- Tailwind CSS
- Shadcn/UI
- Lucide-react

---

## 🛠️ Instalação e Execução do Projeto

### ⚙️ Requisitos
- Node.js instalado
- Gerenciador de pacotes `npm`
- Acesso à internet para instalação das dependências
- MongoDB Atlas ou MongoDB local configurado

---

### 📦 Clonando o Repositório
- https://github.com/Marvio76/PlataformaDeJogos_Online.git

### 🚀 Rodando o Back-end
- 1  Navegue até a pasta do back-end:
- cd backend
- 2 Instalar as dependências:
- npm install
- 3 Início ou servidor:
- npm run dev

### 🌐 Rodando o Front-end
📦 Em um novo terminal, navegue até a massa do front-end e inicie o servidor:
- 1 Início ou servidor:
- npm run dev
