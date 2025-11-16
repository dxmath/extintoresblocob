document.addEventListener("DOMContentLoaded", () => {

  // --- LOGIN ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Preencha todos os campos!");
        return;
      }

      try {
        const response = await fetch("../api/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Login realizado com sucesso!");
          window.location.href = "dashboard.html"; // ajuste conforme a estrutura
        } else {
          alert(result.message || "Email ou senha inválidos.");
        }
      } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro de conexão com o servidor.");
      }
    });
  }

  // --- REGISTRO ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("password").value.trim();
      const confirm = document.getElementById("confirmPassword").value.trim();

      if (!nome || !email || !senha || !confirm) {
        alert("Preencha todos os campos!");
        return;
      }

      if (senha !== confirm) {
        alert("As senhas não coincidem!");
        return;
      }

      try {
        const response = await fetch("../api/signup.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Cadastro realizado com sucesso!");
          window.location.href = "login.html";
        } else {
          alert(result.message || "Erro ao cadastrar.");
        }
      } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro de conexão com o servidor.");
      }
    });
  }

  // --- LOGOUT ---
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      if (confirm("Deseja realmente sair?")) {
        try {
          await fetch("../api/logout.php");
        } catch (err) {
          console.error("Erro ao encerrar sessão:", err);
        }
        localStorage.clear();
        window.location.href = "login.html";
      }
    });
  }
});
