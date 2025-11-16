<?php
// api/login.php

require_once './connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "<script>alert('Método inválido!'); window.location.href='../public/login.html';</script>";
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    echo "<script>alert('Preencha todos os campos!'); window.history.back();</script>";
    exit;
}

try {
    // Consulta segura
    $stmt = $conn->prepare("SELECT id, nome, email, senha, role FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Verifica a senha (usa password_verify com hash)
        if (password_verify($password, $user['senha'])) {
            // Cria a sessão do usuário
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nome'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['loggedin'] = true;

            // Redireciona conforme tipo de usuário
            if (strtolower($user['role']) === 'admin') {
                header("Location: ../public/admin.html");
            } else {
                header("Location: ../public/dashboard.html");
            }
            exit;
        } else {
            echo "<script>alert('Senha incorreta!'); window.history.back();</script>";
            exit;
        }
    } else {
        echo "<script>alert('Usuário não encontrado!'); window.history.back();</script>";
        exit;
    }
} catch (Exception $e) {
    error_log('Erro no login: ' . $e->getMessage());
    echo "<script>alert('Erro no servidor. Tente novamente mais tarde.'); window.history.back();</script>";
    exit;
}

$conn->close();
?>
