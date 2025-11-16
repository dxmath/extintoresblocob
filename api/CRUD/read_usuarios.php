<?php
// Exibir erros temporariamente para depuração
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cabeçalhos
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Inclui a conexão
include_once("../connection.php");

try {
    // Consulta SQL
    $sql = "SELECT id, nome, email, role FROM usuarios ORDER BY id ASC";
    $result = $conn->query($sql);

    if (!$result) {
        // Erro de SQL
        echo json_encode([
            "success" => false,
            "error" => "Erro na consulta SQL: " . $conn->error
        ]);
        exit;
    }

    $usuarios = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = [
                "id_usuario" => $row["id"],
                "nome" => $row["nome"],
                "email" => $row["email"],
                "funcao" => $row["role"]
            ];
        }

        echo json_encode([
            "success" => true,
            "usuarios" => $usuarios
        ]);
    } else {
        // Nenhum usuário encontrado
        echo json_encode([
            "success" => true,
            "usuarios" => []
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

// Fecha conexão
$conn->close();
