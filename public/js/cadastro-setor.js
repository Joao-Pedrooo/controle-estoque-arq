// public/js/cadastro-setor.js

const db = firebase.firestore();

// Função para obter parâmetros da URL
function getParameterByName(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const unitId = getParameterByName("unitId");
const setorId = getParameterByName("setorId");

if (!unitId) {
  alert("Unidade não encontrada.");
  window.location.href = "central-admin-dashboard.html";
}

// Se estiver editando, carregar os dados do setor
if (setorId) {
  db.collection("units")
    .doc(unitId)
    .collection("setores")
    .doc(setorId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const setor = doc.data();
        document.getElementById("nome").value = setor.nome || "";
        document.getElementById("quantidade").value =
          setor.quantidade_funcionarios || "";
        document.getElementById("ativo").checked = setor.ativo === true;
      } else {
        alert("Setor não encontrado.");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar setor:", error);
      alert("Erro ao carregar os dados do setor.");
    });
}

// Evento de envio do formulário (para criar ou atualizar)
document.getElementById("setor-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const setorData = {
    nome: document.getElementById("nome").value.trim(),
    quantidade_funcionarios: parseInt(
      document.getElementById("quantidade").value,
      10
    ),
    ativo: document.getElementById("ativo").checked,
    dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const setoresRef = db.collection("units").doc(unitId).collection("setores");

  if (setorId) {
    // Atualização do setor existente
    setoresRef
      .doc(setorId)
      .update(setorData)
      .then(() => {
        alert("Setor atualizado com sucesso!");
        window.location.href = `setor.html?unitId=${unitId}`;
      })
      .catch((error) => {
        console.error("Erro ao atualizar setor:", error);
        alert("Erro ao atualizar setor.");
      });
  } else {
    // Criação de novo setor
    setoresRef
      .add(setorData)
      .then(() => {
        alert("Setor cadastrado com sucesso!");
        window.location.href = `setor.html?unitId=${unitId}`;
      })
      .catch((error) => {
        console.error("Erro ao cadastrar setor:", error);
        alert("Erro ao cadastrar setor.");
      });
  }
});
