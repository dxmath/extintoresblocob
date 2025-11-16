<?php
// api/CRUD/update_extintor.php
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
$carga = $input['carga'] ?? null;
$capacidade = trim($input['capacidade_extintora'] ?? '');
$id_localizacao = isset($input['id_localizacao']) ? (int)$input['id_localizacao'] : 0;
$id_substancia = isset($input['id_substancia']) ? (int)$input['id_substancia'] : 0;
$id_funcao = isset($input['id_funcao']) ? (int)$input['id_funcao'] : 0;

if ($id_extintor === '' || !is_numeric($carga) || $id_localizacao <= 0 || $id_substancia <= 0 || $id_funcao <= 0) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE Extintor SET carga = ?, capacidade_extintora = ?, id_localizacao = ?, id_substancia = ?, id_funcao = ? WHERE id_extintor = ?");
    $stmt->execute([(float)$carga, $capacidade, $id_localizacao, $id_substancia, $id_funcao, $id_extintor]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Extintor não encontrado']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Extintor atualizado']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar extintor']);
}
