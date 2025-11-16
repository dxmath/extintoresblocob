<?php
// api/reset_password.php
declare(strict_types=1);
require_once __DIR__ . '/connection.php';

header('Content-Type: application/json; charset=UTF-8');

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$newPassword = $input['newPassword'] ?? '';

if ($email === '' || $newPassword === '') {
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos.']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'E-mail não encontrado.']);
        exit;
    }

    // Atualiza senha (aceita qualquer formato)
    $senhaHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE usuarios SET senha = ? WHERE email = ?");
    $stmt->execute([$senhaHash, $email]);

    echo json_encode(['success' => true, 'message' => 'Senha redefinida com sucesso!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao redefinir senha.']);
}
