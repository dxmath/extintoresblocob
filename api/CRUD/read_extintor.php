<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../connection.php';

try {
    $sql = "
        SELECT 
            e.id_extintor,
            e.carga,
            e.capacidade_extintora,
            CONCAT('Piso ', l.piso, ' - Corredor ', l.corredor) AS localizacao,
            s.nome_substancia,
            f.tipo_funcao
        FROM Extintor e
        JOIN Localizacao l ON e.id_localizacao = l.id_localizacao
        JOIN Substancia s ON e.id_substancia = s.id_substancia
        JOIN Funcao f ON e.id_funcao = f.id_funcao
        ORDER BY e.id_extintor ASC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Erro ao executar consulta: " . $conn->error);
    }

    $extintores = [];
    while ($row = $result->fetch_assoc()) {
        $extintores[] = $row;
    }

    echo json_encode(['success' => true, 'extintores' => $extintores], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
