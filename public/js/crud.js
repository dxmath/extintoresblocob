// crud.js

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "../api";

    // Função para exibir mensagens
    function showMessage(elementId, message, type = "info") {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `message ${type}`;
            messageElement.style.display = "block";
            
            // Auto-esconder mensagens de sucesso após 5 segundos
            if (type === "success") {
                setTimeout(() => {
                    messageElement.style.display = "none";
                }, 5000);
            }
        }
    }

    // Função para esconder mensagens
    function hideMessage(elementId) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.style.display = "none";
        }
    }

    // Função para verificar autenticação
    function checkAuth() {
        const apiToken = localStorage.getItem("api_token");
        if (!apiToken) {
            showMessage("message", "Usuário não autenticado. Faça login novamente.", "error");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
            return false;
        }
        return true;
    }

    // Função para carregar extintores no dashboard/admin
    async function loadExtintores() {
        const extintoresTableBody = document.getElementById("extintoresTableBody");
        if (!extintoresTableBody) return;

        extintoresTableBody.innerHTML = "<tr><td colspan='7'>Carregando extintores...</td></tr>";
        hideMessage("message");

        if (!checkAuth()) {
            extintoresTableBody.innerHTML = "";
            return;
        }

        const apiToken = localStorage.getItem("api_token");

        try {
            const response = await fetch(`${API_BASE_URL}/CRUD/read_extintor.php`, {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json"
                }
            });

            // Verifica se a resposta é JSON válido
            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("Resposta não é JSON válido:", text);
                showMessage("message", "Erro no servidor. Tente novamente.", "error");
                extintoresTableBody.innerHTML = "<tr><td colspan='7'>Erro ao carregar dados</td></tr>";
                return;
            }

            if (result.success && result.extintores) {
                extintoresTableBody.innerHTML = ""; // Limpa loading

                if (result.extintores.length > 0) {
                    result.extintores.forEach(extintor => {
                        const row = extintoresTableBody.insertRow();
                        row.innerHTML = `
                            <td>${extintor.id_extintor || 'N/A'}</td>
                            <td>${extintor.carga || 'N/A'}</td>
                            <td>${extintor.capacidade_extintora || 'N/A'}</td>
                            <td>${extintor.piso || 'N/A'}</td>
                            <td>${extintor.corredor || 'N/A'}</td>
                            <td>${extintor.nome_substancia || 'N/A'}</td>
                            <td>${extintor.tipo_funcao || 'N/A'}</td>
                        `;
                    });
                } else {
                    extintoresTableBody.innerHTML = "<tr><td colspan='7'>Nenhum extintor encontrado.</td></tr>";
                }
            } else {
                showMessage("message", result.message || "Erro ao carregar extintores", "error");
                extintoresTableBody.innerHTML = "<tr><td colspan='7'>Erro ao carregar dados</td></tr>";
            }
        } catch (error) {
            console.error("Erro ao carregar extintores:", error);
            showMessage("message", "Erro ao carregar extintores. Verifique sua conexão.", "error");
            extintoresTableBody.innerHTML = "<tr><td colspan='7'>Erro de conexão</td></tr>";
        }
    }

    // Função para carregar opções de localização, substância e função
    async function loadFormOptions() {
        if (!checkAuth()) return;

        const apiToken = localStorage.getItem("api_token");
        
        try {
            // Carregar localizações
            const locResponse = await fetch(`${API_BASE_URL}/CRUD/read_localizacao.php`, {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json"
                }
            });
            
            const localizacoesSelect = document.getElementById("localizacaoId");
            if (localizacoesSelect && locResponse.ok) {
                const result = await locResponse.json();
                if (result.success && result.localizacoes) {
                    localizacoesSelect.innerHTML = '<option value="">Selecione a localização</option>';
                    result.localizacoes.forEach(loc => {
                        const option = document.createElement("option");
                        option.value = loc.id_localizacao;
                        option.textContent = `Piso ${loc.piso} - ${loc.corredor}`;
                        localizacoesSelect.appendChild(option);
                    });
                }
            }

            // Carregar substâncias
            const subResponse = await fetch(`${API_BASE_URL}/CRUD/read_substancia.php`, {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json"
                }
            });
            
            const substanciasSelect = document.getElementById("substanciaId");
            if (substanciasSelect && subResponse.ok) {
                const result = await subResponse.json();
                if (result.success && result.substancias) {
                    substanciasSelect.innerHTML = '<option value="">Selecione a substância</option>';
                    result.substancias.forEach(sub => {
                        const option = document.createElement("option");
                        option.value = sub.id_substancia;
                        option.textContent = sub.nome_substancia;
                        substanciasSelect.appendChild(option);
                    });
                }
            }

            // Carregar funções
            const funcResponse = await fetch(`${API_BASE_URL}/CRUD/read_funcao.php`, {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json"
                }
            });
            
            const funcoesSelect = document.getElementById("funcaoId");
            if (funcoesSelect && funcResponse.ok) {
                const result = await funcResponse.json();
                if (result.success && result.funcoes) {
                    funcoesSelect.innerHTML = '<option value="">Selecione a função</option>';
                    result.funcoes.forEach(func => {
                        const option = document.createElement("option");
                        option.value = func.id_funcao;
                        option.textContent = func.tipo_funcao;
                        funcoesSelect.appendChild(option);
                    });
                }
            }

        } catch (error) {
            console.error("Erro ao carregar opções do formulário:", error);
        }
    }

    // Configurar botões de salvar/atualizar extintor
    function setupExtintorButtons() {
        const extintorIdInput = document.getElementById("extintorId");
        const saveExtintorButton = document.getElementById("saveExtintorButton");
        const updateExtintorButton = document.getElementById("updateExtintorButton");

        if (extintorIdInput && saveExtintorButton && updateExtintorButton) {
            // Verificar estado inicial
            const updateVisibility = () => {
                if (extintorIdInput.value.trim() !== "") {
                    saveExtintorButton.style.display = "none";
                    updateExtintorButton.style.display = "inline-block";
                } else {
                    saveExtintorButton.style.display = "inline-block";
                    updateExtintorButton.style.display = "none";
                }
            };

            // Configurar evento
            extintorIdInput.addEventListener("input", updateVisibility);
            
            // Aplicar estado inicial
            updateVisibility();
        }
    }

    // Formulários de CRUD na página admin.html
    const extintorForm = document.getElementById("extintorForm");
    const deleteExtintorForm = document.getElementById("deleteExtintorForm");

    if (extintorForm) {
        extintorForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideMessage("message");

            if (!checkAuth()) return;

            const apiToken = localStorage.getItem("api_token");
            const id_extintor = document.getElementById("extintorId").value.trim();
            const carga = parseFloat(document.getElementById("carga").value);
            const capacidade_extintora = document.getElementById("capacidadeExtintora").value.trim();
            const id_localizacao = parseInt(document.getElementById("localizacaoId").value);
            const id_substancia = parseInt(document.getElementById("substanciaId").value);
            const id_funcao = parseInt(document.getElementById("funcaoId").value);

            // Validações
            if (!id_extintor) {
                showMessage("message", "Informe o ID do extintor.", "error");
                return;
            }

            if (isNaN(carga) || carga <= 0) {
                showMessage("message", "Carga deve ser um número positivo.", "error");
                return;
            }

            if (!capacidade_extintora) {
                showMessage("message", "Informe a capacidade extintora.", "error");
                return;
            }

            if (isNaN(id_localizacao) || id_localizacao <= 0) {
                showMessage("message", "Selecione uma localização válida.", "error");
                return;
            }

            if (isNaN(id_substancia) || id_substancia <= 0) {
                showMessage("message", "Selecione uma substância válida.", "error");
                return;
            }

            if (isNaN(id_funcao) || id_funcao <= 0) {
                showMessage("message", "Selecione uma função válida.", "error");
                return;
            }

            // Detectar método: POST = criar, PUT = atualizar
            const isUpdate = (e.submitter?.id === "updateExtintorButton");
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? 
                `${API_BASE_URL}/CRUD/update_extintor.php` : 
                `${API_BASE_URL}/CRUD/add_extintor.php`;

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiToken}`
                    },
                    body: JSON.stringify({ 
                        id_extintor, 
                        carga, 
                        capacidade_extintora, 
                        id_localizacao, 
                        id_substancia, 
                        id_funcao 
                    })
                });

                const text = await response.text();
                let result;
                try { 
                    result = JSON.parse(text); 
                } catch (e) { 
                    showMessage("message", "Resposta da API inválida.", "error"); 
                    return; 
                }

                if (result.success) {
                    showMessage("message", result.message, "success");
                    extintorForm.reset();
                    setupExtintorButtons(); // Resetar visibilidade dos botões
                    loadExtintores(); // Recarregar tabela automaticamente
                    
                    // Recarregar opções do formulário se necessário
                    setTimeout(loadFormOptions, 1000);
                } else {
                    showMessage("message", result.message || "Erro ao processar solicitação", "error");
                }
            } catch (error) {
                console.error("Erro ao salvar extintor:", error);
                showMessage("message", "Erro ao salvar extintor. Verifique sua conexão.", "error");
            }
        });
    }

    if (deleteExtintorForm) {
        deleteExtintorForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideMessage("message");

            if (!checkAuth()) return;

            const apiToken = localStorage.getItem("api_token");
            const id_extintor = document.getElementById("deleteExtintorId").value.trim();
            
            if (!id_extintor) {
                showMessage("message", "Informe o ID do extintor para exclusão.", "error");
                return;
            }

            if (!confirm(`Tem certeza que deseja excluir o extintor ${id_extintor}?`)) {
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/CRUD/delete_extintor.php`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiToken}`
                    },
                    body: JSON.stringify({ id_extintor })
                });

                const text = await response.text();
                let result;
                try { 
                    result = JSON.parse(text); 
                } catch (e) { 
                    showMessage("message", "Resposta da API inválida.", "error"); 
                    return; 
                }

                if (result.success) {
                    showMessage("message", result.message, "success");
                    deleteExtintorForm.reset();
                    loadExtintores(); // Atualiza tabela
                } else {
                    showMessage("message", result.message || "Erro ao excluir extintor", "error");
                }
            } catch (error) {
                console.error("Erro ao deletar extintor:", error);
                showMessage("message", "Erro ao deletar extintor. Verifique sua conexão.", "error");
            }
        });
    }

    // Inicialização
    function init() {
        // Carregar extintores se estiver na página
        if (document.getElementById("extintoresTableBody")) {
            loadExtintores();
        }

        // Carregar opções do formulário se estiver na página admin
        if (document.getElementById("extintorForm")) {
            loadFormOptions();
            setupExtintorButtons();
        }
    }

    // Iniciar a aplicação
    init();
});