// public/js/cadastro-produto.js

const db = firebase.firestore();

// Função para obter parâmetros da URL
function getParameterByName(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const unitId = getParameterByName("unitId");
const produtoId = getParameterByName("produtoId");

if (!unitId) {
  alert("Unidade não encontrada.");
  window.location.href = "central-admin-dashboard.html";
}

// Função para carregar os setores e preencher o dropdown
function loadSetores() {
  const setoresRef = db.collection("units").doc(unitId).collection("setores");
  setoresRef.orderBy("dataCadastro", "desc").onSnapshot(
    (snapshot) => {
      let options = `<option value="">Selecione o setor</option>`;
      snapshot.forEach((doc) => {
        const setor = doc.data();
        options += `<option value="${doc.id}">${setor.nome}</option>`;
      });
      document.getElementById("setor-select").innerHTML = options;
    },
    (error) => {
      console.error("Erro ao carregar setores:", error);
    }
  );
}
loadSetores();

// Se estiver editando, carregar os dados do produto
if (produtoId) {
  db.collection("units")
    .doc(unitId)
    .collection("produtos")
    .doc(produtoId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const produto = doc.data();
        document.getElementById("nome").value = produto.nome || "";
        document.getElementById("unidade").value = produto.unidade || "";
        document.getElementById("estoque_atual").value =
          produto.estoque_atual || "";
        document.getElementById("estoque_minimo").value =
          produto.estoque_minimo || "";
        document.getElementById("estoque_maximo").value =
          produto.estoque_maximo || "";
        document.getElementById("grupo").value = produto.grupo || "";
        document.getElementById("rendimento").value =
          produto.rendimento_pronto_uso || "";
        document.getElementById("foto").value = produto.foto || "";
        if (produto.setorId) {
          document.getElementById("setor-select").value = produto.setorId;
        }
      } else {
        alert("Produto não encontrado.");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar produto:", error);
      alert("Erro ao carregar os dados do produto.");
    });
}

// Evento de envio do formulário para criar ou atualizar o produto
document
  .getElementById("produto-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const produtoData = {
      nome: document.getElementById("nome").value.trim(),
      unidade: document.getElementById("unidade").value.trim(),
      estoque_atual: parseFloat(document.getElementById("estoque_atual").value),
      estoque_minimo: parseFloat(
        document.getElementById("estoque_minimo").value
      ),
      estoque_maximo: parseFloat(
        document.getElementById("estoque_maximo").value
      ),
      grupo: document.getElementById("grupo").value.trim(),
      rendimento_pronto_uso: document.getElementById("rendimento").value.trim(),
      foto: document.getElementById("foto").value.trim(),
      setorId: document.getElementById("setor-select").value,
      dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const produtosRef = db
      .collection("units")
      .doc(unitId)
      .collection("produtos");

    if (produtoId) {
      // Atualiza o produto existente
      produtosRef
        .doc(produtoId)
        .update(produtoData)
        .then(() => {
          alert("Produto atualizado com sucesso!");
          window.location.href = `produtos.html?unitId=${unitId}`;
        })
        .catch((error) => {
          console.error("Erro ao atualizar produto:", error);
          alert("Erro ao atualizar produto.");
        });
    } else {
      // Cria um novo produto
      produtosRef
        .add(produtoData)
        .then((docRef) => {
          alert("Produto cadastrado com sucesso!");
          window.location.href = `produtos.html?unitId=${unitId}`;
        })
        .catch((error) => {
          console.error("Erro ao cadastrar produto:", error);
          alert("Erro ao cadastrar produto.");
        });
    }
  });
