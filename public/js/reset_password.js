document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageDiv = document.getElementById("message");

    if (newPassword !== confirmPassword) {
        messageDiv.textContent = "As senhas não coincidem!";
        messageDiv.style.color = "red";
        return;
    }

    try {
        const response = await fetch(".../api/reset_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                newPassword: newPassword
            })
        });

        const result = await response.json();
        messageDiv.textContent = result.message;
        messageDiv.style.color = result.success ? "green" : "red";

        if (result.success) {
            setTimeout(() => {
                window.location.href = ".../login.html";
            }, 2000);
        }

    } catch (error) {
        messageDiv.textContent = "Erro ao conectar ao servidor.";
        messageDiv.style.color = "red";
    }
});
