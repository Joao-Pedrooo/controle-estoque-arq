// public/js/setor.js

// Obtenha as instâncias globais definidas em main.js
const db = firebase.firestore();
const auth = firebase.auth();

// Função para obter o unitId da URL
function getUnitId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("unitId");
}

const unitId = getUnitId();
if (!unitId) {
  alert("Unidade não encontrada.");
  window.location.href = "central-admin-dashboard.html";
}

// Atualiza o link "Painel da Unidade" na navbar com o unitId
document.getElementById("back-link").href = `admin-unit.html?unitId=${unitId}`;

// Função para carregar os setores (setores)
function loadSetores() {
  // Acessa a subcoleção "setores" dentro do documento da unidade
  const setoresRef = db.collection("units").doc(unitId).collection("setores");

  setoresRef.orderBy("dataCadastro", "desc").onSnapshot(
    (snapshot) => {
      let html = "";
      if (snapshot.empty) {
        html = `<p class="text-muted">Nenhum setor cadastrado.</p>`;
      } else {
        html = `<table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Nome do Setor</th>
                      <th>Qtd. Funcionários</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>`;
        snapshot.forEach((doc) => {
          const setor = doc.data();
          html += `
            <tr>
              <td>${setor.nome}</td>
              <td>${setor.quantidade_funcionarios || 0}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="editarSetor('${
                  doc.id
                }')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirSetor('${
                  doc.id
                }')">Excluir</button>
              </td>
            </tr>
          `;
        });
        html += `</tbody></table>`;
      }
      document.getElementById("setores-list").innerHTML = html;
    },
    (error) => {
      console.error("Erro ao carregar setores:", error);
      document.getElementById(
        "setores-list"
      ).innerHTML = `<p class="text-danger">Erro ao carregar setores.</p>`;
    }
  );
}

// Função para editar um setor
function editarSetor(setorId) {
  // Redireciona para a página de cadastro/edição de setor, passando unitId e setorId
  window.location.href = `cadastro-setor.html?unitId=${unitId}&setorId=${setorId}`;
}

// Função para excluir um setor
function excluirSetor(setorId) {
  if (confirm("Tem certeza que deseja excluir este setor?")) {
    db.collection("units")
      .doc(unitId)
      .collection("setores")
      .doc(setorId)
      .delete()
      .then(() => alert("Setor excluído com sucesso!"))
      .catch((error) => {
        console.error("Erro ao excluir setor:", error);
        alert("Erro ao excluir setor.");
      });
  }
}

// Configura o botão para adicionar um novo setor
document.getElementById("add-setor-btn").addEventListener("click", () => {
  // Redireciona para a página de cadastro de setor, passando o unitId
  window.location.href = `cadastro-setor.html?unitId=${unitId}`;
});

// Carrega os setores quando a página for carregada
window.addEventListener("load", loadSetores);
