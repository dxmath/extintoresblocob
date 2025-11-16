<?php
// api/CRUD/delete_extintor.php
declare(strict_types=1);
require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../auth.php';

$currentUser = require_auth($conn);
if (!in_array($currentUser['role'], ['admin','superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acesso negado']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id_extintor = trim($input['id_extintor'] ?? '');

if ($id_extintor === '') {
    echo json_encode(['success' => false, 'message' => 'ID do extintor é obrigatório']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM Extintor WHERE id_extintor = ?");
    $stmt->execute([$id_extintor]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Extintor não encontrado']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Extintor deletado']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao deletar extintor']);
}
