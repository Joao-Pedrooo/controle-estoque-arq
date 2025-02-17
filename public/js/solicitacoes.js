// js/solicitacoes.js
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
const auth = getAuth();

async function enviarSolicitacao() {
  const item = document.getElementById("itemSolicitacao").value.trim();
  const quantidade = parseInt(
    document.getElementById("quantidadeSolicitacao").value.trim()
  );

  const user = auth.currentUser;
  if (!user) {
    alert("Você precisa estar logado para enviar solicitações.");
    return;
  }

  const solicitacaoData = {
    item,
    quantidade,
    status: "pendente",
    dataSolicitacao: firebase.firestore.FieldValue.serverTimestamp(),
    usuarioId: user.uid,
  };

  try {
    await firebase.firestore().collection("solicitacoes").add(solicitacaoData);
    alert("Solicitação enviada com sucesso!");
    document.getElementById("form-solicitacao").reset();
    carregarSolicitacoes();
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
    alert("Erro ao enviar solicitação.");
  }
}

async function carregarSolicitacoes() {
  const user = auth.currentUser;
  const container = document.getElementById("lista-solicitacoes");
  if (!user) {
    container.innerHTML = "Você precisa estar logado.";
    return;
  }
  try {
    const snapshot = await firebase
      .firestore()
      .collection("solicitacoes")
      .where("usuarioId", "==", user.uid)
      .orderBy("dataSolicitacao", "desc")
      .get();
    let html = `<ul class="list-group">`;
    snapshot.forEach((doc) => {
      const data = doc.data();
      html += `<li class="list-group-item">
                 ${data.item} - Quantidade: ${data.quantidade} - Status: ${data.status}
               </li>`;
    });
    html += `</ul>`;
    container.innerHTML = html;
  } catch (error) {
    console.error("Erro ao carregar solicitações:", error);
    container.innerHTML = "Erro ao carregar solicitações.";
  }
}

document.getElementById("form-solicitacao").addEventListener("submit", (e) => {
  e.preventDefault();
  enviarSolicitacao();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    carregarSolicitacoes();
  }
});
