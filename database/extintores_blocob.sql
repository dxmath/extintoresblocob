-- Criar banco
CREATE DATABASE IF NOT EXISTS extintoresblocob;
USE extintoresblocob;

-- ===================== TABELA USUARIOS 
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,            -- Identificador do usuário
    nome VARCHAR(100) NOT NULL,                  -- Nome do usuário
    email VARCHAR(100) NOT NULL UNIQUE,          -- E-mail para login
    senha VARCHAR(255) NOT NULL,                 -- Senha criptografada
    role ENUM('user','admin') NOT NULL DEFAULT 'user'  -- Tipo de acesso
);

-- ===================== TABELA LOCALIZACAO 
CREATE TABLE localizacao (
    id_localizacao INT AUTO_INCREMENT PRIMARY KEY,   -- Identificador da localização
    piso VARCHAR(50) NOT NULL,                       -- Andar (ex: 1º andar)
    corredor VARCHAR(100) NOT NULL                    -- Corredor (ex: Bloco B Leste)
);

-- ===================== TABELA SUBSTANCIA 
CREATE TABLE substancia (
    id_substancia INT AUTO_INCREMENT PRIMARY KEY,     -- Identificador da substância
    nome_substancia VARCHAR(100) NOT NULL             -- Nome do agente extintor
);

-- ===================== TABELA FUNCAO 
CREATE TABLE funcao (
    id_funcao INT AUTO_INCREMENT PRIMARY KEY,         -- Identificador da função
    tipo_funcao VARCHAR(50) NOT NULL                  -- Classe(s) de fogo (ex: Classe A, Classes B e C)
);

-- ===================== TABELA EXTINTOR 
CREATE TABLE extintor (
    id_extintor VARCHAR(50) PRIMARY KEY,              -- Número de série do extintor
    carga VARCHAR(25) NOT NULL,                       -- Carga (ex: 4 kg, 10 litros)
    capacidade_extintora VARCHAR(25) NOT NULL,        -- Capacidade (ex: 10BC, 2A)
    id_localizacao INT NOT NULL,                      -- FK localização
    id_substancia INT NOT NULL,                       -- FK substância
    id_funcao INT NOT NULL,                           -- FK função

    FOREIGN KEY (id_localizacao) REFERENCES localizacao(id_localizacao)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (id_substancia) REFERENCES substancia(id_substancia)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (id_funcao) REFERENCES funcao(id_funcao)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ===================== INSERTS BASICOS 

-- SUBSTÂNCIAS
INSERT INTO substancia (nome_substancia) VALUES
('CO2'),
('Água'),
('Pó Químico BC');

-- FUNÇÕES / CLASSES DE FOGO
INSERT INTO funcao (tipo_funcao) VALUES
('Classe A'),
('Classe B'),
('Classe C'),
('Classes B e C'),
('Classes A, B e C');

-- LOCALIZAÇÕES
INSERT INTO localizacao (piso, corredor) VALUES
('1º andar', 'Bloco B Sul'),
('1º andar', 'Bloco B Leste'),
('1º andar', 'Bloco B Leste'),
('1º andar', 'Bloco B Leste'),
('1º andar', 'Bloco B Leste'),
('1º andar', 'Bloco B Oeste'),
('1º andar', 'Bloco B Oeste'),
('2º andar', 'Bloco B Sul'),
('2º andar', 'Bloco B Oeste'),
('2º andar', 'Bloco B Oeste'),
('2º andar', 'Bloco B Oeste'),
('2º andar', 'Bloco B Oeste'),
('2º andar', 'Bloco B Leste'),
('2º andar', 'Bloco B Leste'),
('2º andar', 'Bloco B Leste'),
('2º andar', 'Bloco B Norte'),
('3º andar', 'Bloco B Norte'),
('3º andar', 'Bloco B Oeste'),
('3º andar', 'Bloco B Oeste'),
('3º andar', 'Bloco B Oeste'),
('3º andar', 'Bloco B Oeste'),
('3º andar', 'Bloco B Oeste'),
('3º andar', 'Bloco B Oeste'),
('3º andar', 'Bloco B Norte'),
('3º andar', 'Bloco B Norte'),
('3º andar', 'Bloco B Norte');

-- EXTINTORES
INSERT INTO extintor (id_extintor, carga, capacidade_extintora, id_localizacao, id_substancia, id_funcao) VALUES
('300176347', '4 kg', '5BC', 1, 1, 4),
('300176458', '10 litros', '2A', 2, 2, 1),
('300176427', '4 kg', '10BC', 3, 3, 4),
('300451781', '10 litros', '2A', 4, 2, 1),
('300176428', '4 kg', '10BC', 5, 3, 4),
('300451997', '4 kg', '10BC', 6, 3, 4),
('300451985', '10 litros', '2A', 7, 2, 1),
('300452026', '4 kg', '5BC', 8, 1, 4),
('300451774', '4 kg', '10BC', 9, 3, 4),
('300176446', '10 litros', '2A', 10, 2, 1),
('300451998', '4 kg', '10BC', 11, 3, 4),
('300451979', '10 litros', '2A', 12, 2, 1),
('300176425', '4 kg', '10BC', 13, 3, 4),
('300452004', '10 litros', '2A', 14, 2, 1),
('300452017', '4 kg', '20BC', 15, 3, 4),
('300452027', '6 kg', '5BC', 16, 1, 4),
('300452024', '6 kg', '5BC', 17, 1, 4),
('300452005', '10 litros', '2A', 18, 2, 1),
('300452018', '6 kg', '20BC', 19, 3, 4),
('300176455', '10 litros', '2A', 20, 2, 1),
('300452002', '10 litros', '2A', 21, 2, 1),
('300452006', '10 litros', '2A', 22, 2, 1),
('300451792', '6 kg', '20BC', 23, 3, 4),
('300452007', '10 litros', '2A', 24, 2, 1),
('300452016', '6 kg', '20BC', 25, 3, 4),
('300176484', '4 kg', '5BC', 26, 1, 4);
