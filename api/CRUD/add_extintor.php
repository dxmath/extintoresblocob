<?php
// api/CRUD/add_extintor.php
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

// validações básicas
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
    $stmt = $conn->prepare("INSERT INTO Extintor (id_extintor, carga, capacidade_extintora, id_localizacao, id_substancia, id_funcao)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id_extintor, (float)$carga, $capacidade, $id_localizacao, $id_substancia, $id_funcao]);
    echo json_encode(['success' => true, 'message' => 'Extintor adicionado']);
} catch (PDOException $e) {
    // tratar chave primária duplicada
    if ($e->errorInfo[1] === 1062) {
        echo json_encode(['success' => false, 'message' => 'ID do extintor já existe']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erro ao adicionar extintor']);
    }
}
