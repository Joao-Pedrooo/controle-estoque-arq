// public/js/estoque.js

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

// Atualiza o link "Painel da Unidade" no navbar com o unitId
document.getElementById("back-link").href = `admin-unit.html?unitId=${unitId}`;

// Botão de Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  auth
    .signOut()
    .then(() => (window.location.href = "admin-unit-login.html"))
    .catch((error) => alert("Erro ao sair."));
});

// Botão para adicionar produto
document.getElementById("add-product-btn").addEventListener("click", () => {
  // Redireciona para a página de cadastro de produto, passando unitId
  window.location.href = `cadastro-produto.html?unitId=${unitId}`;
});

// Função para carregar produtos do estoque
function loadProdutos() {
  // Acessa a subcoleção "produtos" da unidade
  const produtosRef = db.collection("units").doc(unitId).collection("produtos");
  produtosRef.orderBy("dataCadastro", "desc").onSnapshot(
    (snapshot) => {
      let html = "";
      if (snapshot.empty) {
        html = `<p class="text-muted">Nenhum produto cadastrado.</p>`;
      } else {
        html = `<table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Unidade</th>
                      <th>Estoque Atual</th>
                      <th>Estoque Mínimo</th>
                      <th>Estoque Máximo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>`;
        snapshot.forEach((doc) => {
          const produto = doc.data();
          html += `
            <tr>
              <td>${produto.nome}</td>
              <td>${produto.unidade}</td>
              <td>${produto.estoque_atual}</td>
              <td>${produto.estoque_minimo}</td>
              <td>${produto.estoque_maximo}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="editarProduto('${doc.id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirProduto('${doc.id}')">Excluir</button>
              </td>
            </tr>
          `;
        });
        html += `</tbody></table>`;
      }
      document.getElementById("produtos-list").innerHTML = html;
    },
    (error) => {
      console.error("Erro ao carregar produtos:", error);
      document.getElementById(
        "produtos-list"
      ).innerHTML = `<p class="text-danger">Erro ao carregar produtos.</p>`;
    }
  );
}

// Função para editar um produto
function editarProduto(produtoId) {
  // Redireciona para a página de cadastro/edição de produto com unitId e produtoId na URL
  window.location.href = `cadastro-produto.html?unitId=${unitId}&produtoId=${produtoId}`;
}

// Função para excluir um produto
function excluirProduto(produtoId) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    db.collection("units")
      .doc(unitId)
      .collection("produtos")
      .doc(produtoId)
      .delete()
      .then(() => alert("Produto excluído com sucesso!"))
      .catch((error) => {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto.");
      });
  }
}

window.addEventListener("load", loadProdutos);
