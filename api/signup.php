<?php
header('Content-Type: application/json');
require_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método inválido"]);
    exit;
}

// Lê o JSON enviado pelo fetch()
$input = json_decode(file_get_contents("php://input"), true);

// Recebe os dados
$name = trim($input['nome'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['senha'] ?? '');

// Verifica se todos os campos foram preenchidos
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Todos os campos são obrigatórios"]);
    exit;
}

// Verifica email válido
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Email inválido"]);
    exit;
}

// Verifica se email já existe
$query = "SELECT id FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "E-mail já cadastrado"]);
    exit;
}

// Criptografa senha
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insere o usuário
$insert = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
$stmt = $conn->prepare($insert);
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cadastro realizado com sucesso"]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao cadastrar usuário"]);
}

$stmt->close();
$conn->close();
?>
