<?php
// api/auth.php
session_start();
require_once __DIR__ . '/connection.php';

function require_auth(mysqli $conn) {
    if (!isset($_SESSION['user_id'])) {
        // Se não estiver logado, redireciona para o login
        header("Location: ../public/login.html");
        exit();
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT id, nome, email FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        session_destroy();
        header("Location: ../public/login.html");
        exit();
    }

    return $user;
}
?>
