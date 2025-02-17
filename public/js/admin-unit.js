const db = firebase.firestore();
const auth = firebase.auth();

// Obtém o ID da unidade da URL
const urlParams = new URLSearchParams(window.location.search);
const unitId = urlParams.get("unitId");

if (!unitId) {
  alert("Unidade não encontrada.");
  window.location.href = "central-admin-dashboard.html";
}

// Carrega os dados da unidade e atualiza a interface
db.collection("units")
  .doc(unitId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("unit-name").innerText = data.nomeUnidade;
      document.getElementById("unit-location").innerText = data.localizacao;
      document.getElementById("unit-contract").innerText = data.contrato;
      document.getElementById("unit-admin").innerText = data.admin
        ? data.admin.nome
        : "N/A";

      // Atualize links dos módulos, se necessário
    } else {
      alert("Unidade não encontrada.");
      window.location.href = "central-admin-dashboard.html";
    }
  })
  .catch((error) => {
    console.error("Erro ao carregar unidade:", error);
    alert("Erro ao carregar os dados da unidade.");
    window.location.href = "central-admin-dashboard.html";
  });

// Função para carregar o conteúdo de cada aba
function loadTabContent(tabName) {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = `<p class="text-muted">Carregando ${tabName}...</p>`;

  if (tabName === "estoque") {
    // Redireciona para a página de Estoque
    window.location.href = `estoque.html?unitId=${unitId}`;
  } else if (tabName === "pedidos") {
    // Redireciona para a página de Pedidos
    window.location.href = `pedidos.html?unitId=${unitId}`;
  } else if (tabName === "funcionarios") {
    // Redireciona para a página de Funcionários
    window.location.href = `funcionarios.html?unitId=${unitId}`;
  } else if (tabName === "setor") {
    // Redireciona para a página de Setores
    window.location.href = `setor.html?unitId=${unitId}`;
  } else if (tabName === "solicitacao") {
    // Redireciona para a página de Solicitação de Itens
    window.location.href = `solicitacao.html?unitId=${unitId}`;
  }
}

// Liga os eventos das abas para redirecionamento imediato
document
  .getElementById("tab-estoque")
  .addEventListener("click", () => loadTabContent("estoque"));
document
  .getElementById("tab-pedidos")
  .addEventListener("click", () => loadTabContent("pedidos"));
document
  .getElementById("tab-funcionarios")
  .addEventListener("click", () => loadTabContent("funcionarios"));
document
  .getElementById("tab-setor")
  .addEventListener("click", () => loadTabContent("setor"));
document
  .getElementById("tab-solicitacao")
  .addEventListener("click", () => loadTabContent("solicitacao"));

// Logout: redireciona para a página de login do painel da unidade (sem unitId)
document.getElementById("logout-btn").addEventListener("click", () => {
  auth
    .signOut()
    .then(() => (window.location.href = "admin-unit-login.html"))
    .catch((error) => alert("Erro ao sair."));
});
