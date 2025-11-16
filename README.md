# Sistema de Gerenciamento de Extintores - Bloco B

Este projeto implementa um sistema completo para **gerenciamento de extintores de incêndio**, focado no Bloco B. Ele utiliza uma arquitetura tradicional com **backend em PHP**, **banco de dados MySQL** e **frontend em HTML, CSS e JavaScript**. O sistema permite o registro de usuários, autenticação robusta e funcionalidades CRUD (Criar, Ler, Atualizar, Deletar) para os extintores, além de um painel administrativo para controle e gestão de usuários.

## 🌟 Funcionalidades Principais

O sistema é estruturado para oferecer diferentes níveis de acesso e controle sobre os dados dos extintores:

*   **Autenticação de Usuários**: Implementação completa de Registro, Login, Logout e Redefinição de Senha.
*   **Gerenciamento de Extintores (CRUD)**: Permite adicionar, visualizar, atualizar e deletar registros de extintores.
*   **Controle de Acesso por Roles**: O sistema suporta três níveis de permissão:
    *   `user`: Acesso ao Dashboard para visualização da lista de extintores.
    *   `admin`: Acesso ao Painel Administrativo para gerenciar extintores (CRUD).
    *   `superadmin`: Acesso total, incluindo a gestão de outros usuários.
*   **Dashboard Interativo**: Visualização clara e organizada da lista de extintores para usuários logados.
*   **Painel Administrativo**: Interface dedicada para administradores gerenciarem tanto os extintores quanto os usuários do sistema.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Backend** | PHP | Linguagem de programação principal para a lógica de negócios e API. |
| **Banco de Dados** | MySQL | Sistema de gerenciamento de banco de dados relacional para persistência de dados. |
| **Conexão DB** | MySQLi | Extensão do PHP utilizada para a comunicação com o MySQL. |
| **Servidor Web** | Apache | Servidor HTTP necessário para executar o PHP e servir os arquivos estáticos. |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Tecnologias padrão para a interface do usuário e interatividade. |

## 📁 Estrutura de Diretórios

A estrutura de diretórios do projeto é organizada da seguinte forma:

```
ExtintoresBlocoB/
├── api/
│   ├── CRUD/
│   │   ├── add_extintor.php
│   │   ├── delete_extintor.php
│   │   ├── read_extintor.php
│   │   ├── read_usuarios.php
│   │   └── update_extintor.php
│   ├── auth.php
│   ├── connection.php
│   ├── gerar_hash.php
│   ├── login.php
│   ├── logout.php
│   ├── reset_password.php
│   ├── signup.php
│   └── users_list.php
├── database/
│   └── extintores_blocob.sql
├── public/
│   ├── css/
│   │   ├── admin.css
│   │   ├── dashboard.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── register.css
│   │   └── reset_password.css
│   ├── images/
│   ├── js/
│   │   ├── admin.js
│   │   ├── crud.js
│   │   ├── main.js
│   │   └── reset_password.js
│   ├── .htaccess
│   ├── admin.html
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── reset_password.html
└── README.md
```

## 🚀 Instalação e Configuração

Para colocar o projeto em funcionamento, siga os passos abaixo. Recomenda-se o uso de um ambiente de desenvolvimento como **XAMPP** ou **WAMP** que já inclui Apache, PHP e MySQL.

### 1. Clonar o Repositório

Embora este seja um arquivo ZIP, em um cenário real, você faria:

```bash
git clone [URL_DO_REPOSITORIO]
cd ExtintoresBlocoB
```

### 2. Configurar o Servidor Web

Mova o conteúdo da pasta `ExtintoresBlocoB` para o diretório de documentos do seu servidor web (ex: `htdocs` no XAMPP).

**Caminho Esperado:** `C:\xampp\htdocs\ExtintoresBlocoB\`

### 3. Configurar o Banco de Dados

O projeto inclui um script SQL para criar o banco de dados e as tabelas necessárias.

1.  Acesse o painel de administração do MySQL (ex: phpMyAdmin).
2.  Crie um novo banco de dados chamado `ExtintoresBlocoB`.
3.  Importe o script SQL contido no arquivo `database/extintores_blocob.sql` (ou use o código abaixo) para criar as tabelas e popular dados iniciais de localização, substância e função.

```sql
-- Conteúdo de database/extintores_blocob.sql
CREATE DATABASE IF NOT EXISTS ExtintoresBlocoB;
USE ExtintoresBlocoB;

-- Tabela de usuários (admin e comuns)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Localização
CREATE TABLE Localizacao (
  id_localizacao INT PRIMARY KEY AUTO_INCREMENT,
  piso INT NOT NULL CHECK (piso IN (1,2,3)),
  corredor ENUM('Norte','Sul','Leste','Oeste') NOT NULL
);

-- Tabela de Substância
CREATE TABLE Substancia (
  id_substancia INT PRIMARY KEY AUTO_INCREMENT,
  nome_substancia VARCHAR(50) NOT NULL
);

-- Tabela de Função
CREATE TABLE Funcao (
  id_funcao INT PRIMARY KEY AUTO_INCREMENT,
  tipo_funcao ENUM('A','B','C','D','K') NOT NULL
);

-- Tabela de Extintores
CREATE TABLE Extintor (
  id_extintor VARCHAR(50) PRIMARY KEY,
  carga DECIMAL(5,2) NOT NULL,
  capacidade_extintora VARCHAR(50),
  id_localizacao INT NOT NULL,
  id_substancia INT NOT NULL,
  id_funcao INT NOT NULL,
  FOREIGN KEY (id_localizacao) REFERENCES Localizacao(id_localizacao),
  FOREIGN KEY (id_substancia) REFERENCES Substancia(id_substancia),
  FOREIGN KEY (id_funcao) REFERENCES Funcao(id_funcao)
);

-- Inserir dados iniciais
INSERT INTO Localizacao (piso, corredor) VALUES (1, 'Norte'), (1, 'Sul'), (2, 'Leste'), (3, 'Oeste');
INSERT INTO Substancia (nome_substancia) VALUES ('Água'), ('Pó Químico'), ('CO2'), ('Espuma');
INSERT INTO Funcao (tipo_funcao) VALUES ('A'), ('B'), ('C'), ('D'), ('K');
```

### 4. Configurar a Conexão com o Banco de Dados

O arquivo de conexão está em `api/connection.php`. Ele está pré-configurado para as credenciais padrão do XAMPP (`root` sem senha).

```php
// api/connection.php
<?php
$servername = "localhost";
$username = "root";     // Usuário padrão do XAMPP
$password = "";         // Senha padrão do XAMPP (geralmente vazia)
$dbname = "ExtintoresBlocoB";

// ... restante do código de conexão
```

Se o seu ambiente tiver credenciais diferentes, ajuste as variáveis `$username` e `$password` neste arquivo.

### 5. Acessar a Aplicação

Após a configuração, a aplicação pode ser acessada através do seu navegador:

**URL Principal:** `http://localhost/ExtintoresBlocoB/public/`

## Uso da Aplicação

### Fluxo de Usuário

1.  **Registro**: Acesse `register.html` para criar uma nova conta. Por padrão, a conta será criada com a role `user`.
2.  **Login**: Acesse `login.html` e insira suas credenciais.
3.  **Dashboard**: Após o login, você será redirecionado para `dashboard.html`, onde poderá visualizar a lista de extintores.

### Acesso Administrativo

Para acessar o painel administrativo (`admin.html`), o usuário deve ter a role `admin` ou `superadmin`.

*   **Promover Usuário**: Para testar as funcionalidades administrativas, você pode alterar manualmente a coluna `role` na tabela `usuarios` do seu banco de dados para `admin` ou `superadmin`.
*   **Painel Admin**: Permite o CRUD de extintores e, para `superadmin`, a visualização da lista de todos os usuários.

## 🔗 Endpoints da API (PHP)

A API é a espinha dorsal do sistema, fornecendo dados em formato JSON.

| Caminho do Arquivo | Método | Descrição |
| :--- | :--- | :--- |
| `api/signup.php` | `POST` | Cria um novo usuário. |
| `api/login.php` | `POST` | Autentica o usuário e inicia a sessão. |
| `api/logout.php` | `POST` | Encerra a sessão do usuário. |
| `api/send_code.php` | `POST` | Envia código para redefinição de senha. |
| `api/reset_password.php` | `POST` | Redefine a senha do usuário. |
| `api/CRUD/add_extintor.php` | `POST` | Adiciona um novo extintor ao sistema. |
| `api/CRUD/read_extintor.php` | `GET` | Retorna a lista de todos os extintores. |
| `api/CRUD/update_extintor.php` | `POST` | Atualiza os dados de um extintor existente. |
| `api/CRUD/delete_extintor.php` | `POST` | Remove um extintor do sistema. |
| `api/CRUD/read_usuarios.php` | `GET` | Retorna a lista de todos os usuários (apenas para `superadmin`). |


