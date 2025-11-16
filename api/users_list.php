<?php
// api/users_list.php
declare(strict_types=1);
require_once __DIR__ . '/connection.php';
require_once __DIR__ . '/auth.php';

$currentUser = require_auth($conn);
if ($currentUser['role'] !== 'superadmin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acesso negado']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, nome, email, role, criado_em FROM usuarios ORDER BY id ASC");
    $stmt->execute();
    $users = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'users' => $users]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao listar usuários']);
}
?>