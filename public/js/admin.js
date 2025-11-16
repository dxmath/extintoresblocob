document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script admin.js inicializado com sucesso!");

  const API_BASE = "../api/CRUD/";

  // --- LOGOUT ---
  const logoutBtn = document.querySelector(".logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (confirm("Deseja realmente sair?")) {
        try {
          const response = await fetch("../api/logout.php", { method: "POST" });
          const result = await response.json();
          console.log(result.message || "Sessão encerrada.");
        } catch (err) {
          console.error("Erro ao encerrar sessão:", err);
        }
        localStorage.clear();
        window.location.href = "login.html";
      }
    });
  }

  // --- CARREGAR EXTINTORES ---
  async function carregarExtintores() {
    try {
      const response = await fetch(`${API_BASE}read_extintor.php`);
      const result = await response.json();

      const totalExt = document.querySelector(".total-extintores");
      const tbody = document.querySelector(".tabela-extintores tbody");
      const searchInput = document.getElementById("searchInput");

      if (!result.success || !result.extintores?.length) {
        totalExt.textContent = "0";
        tbody.innerHTML = `<tr><td colspan="6" class="empty">Nenhum extintor encontrado</td></tr>`;
        return;
      }

      totalExt.textContent = result.extintores.length;
      tbody.innerHTML = "";

      result.extintores.forEach(ext => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${ext.id_extintor}</td>
          <td>${ext.carga}</td>
          <td>${ext.capacidade_extintora}</td>
          <td>${ext.localizacao || "Não informado"}</td>
          <td>${ext.nome_substancia}</td>
          <td>${ext.tipo_funcao}</td>
        `;
        tbody.appendChild(tr);
      });

      if (searchInput) {
        searchInput.addEventListener("input", () => {
          const term = searchInput.value.toLowerCase();
          tbody.querySelectorAll("tr").forEach(tr => {
            tr.style.display = tr.innerText.toLowerCase().includes(term) ? "" : "none";
          });
        });
      }
    } catch (error) {
      console.error("Erro ao carregar extintores:", error);
    }
  }

  // --- CARREGAR USUÁRIOS ---
  async function carregarUsuarios() {
    try {
      const response = await fetch(`${API_BASE}read_usuarios.php`);
      const result = await response.json();

      const totalUser = document.querySelector(".total-usuarios");
      const tbody = document.querySelector(".tabela-usuarios tbody");
      const searchInput = document.getElementById("searchInputUsuarios");

      if (!result.success || !result.usuarios?.length) {
        totalUser.textContent = "0";
        tbody.innerHTML = `<tr><td colspan="5" class="empty">Nenhum usuário encontrado</td></tr>`;
        return;
      }

      totalUser.textContent = result.usuarios.length;
      tbody.innerHTML = "";

      result.usuarios.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.id_usuario}</td>
          <td>${user.nome}</td>
          <td>${user.email}</td>
          <td>${user.funcao || "Usuário"}</td>
          <td>
            <button class="edit-user"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-user"><i class="fa-solid fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      if (searchInput) {
        searchInput.addEventListener("input", () => {
          const term = searchInput.value.toLowerCase();
          tbody.querySelectorAll("tr").forEach(tr => {
            tr.style.display = tr.innerText.toLowerCase().includes(term) ? "" : "none";
          });
        });
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }

  // --- INICIALIZAÇÃO ---
  carregarExtintores();
  carregarUsuarios();
});
