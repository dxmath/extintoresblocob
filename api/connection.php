<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "extintoresblocob";

// Cria conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica erro
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Define charset para UTF-8
$conn->set_charset("utf8");
?>
