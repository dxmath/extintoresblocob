<?php
header('Content-Type: application/json');
require_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método inválido"]);
    exit;
}

// Recebe os dados do formulário (nomes compatíveis com o HTML)
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');
$confirmPassword = trim($_POST['confirmPassword'] ?? '');

// Verifica se todos os campos foram preenchidos
if (empty($name) || empty($email) || empty($password) || empty($confirmPassword)) {
    echo json_encode(["success" => false, "message" => "Todos os campos são obrigatórios"]);
    exit;
}

// Verifica se as senhas coincidem
if ($password !== $confirmPassword) {
    echo json_encode(["success" => false, "message" => "As senhas não coincidem"]);
    exit;
}

// Validação básica de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Email inválido"]);
    exit;
}

// Verifica se o e-mail já existe no banco
$query = "SELECT id FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "E-mail já cadastrado"]);
    exit;
}

// Criptografa a senha
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insere o novo usuário
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
