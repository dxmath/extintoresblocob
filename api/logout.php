<?php
// api/logout.php
header("Content-Type: application/json; charset=UTF-8");

// Verifica se o método é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método inválido! Use POST para logout."
    ]);
    exit;
}

session_start();

try {
    // Destroi todas as variáveis de sessão
    $_SESSION = [];

    // Destroi o cookie da sessão, se existir
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    // Finaliza a sessão
    session_destroy();

    echo json_encode([
        "success" => true,
        "message" => "Logout realizado com sucesso."
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erro ao realizar logout."
    ]);
}
