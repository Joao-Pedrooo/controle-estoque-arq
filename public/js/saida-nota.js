// js/saida-nota.js

// URL da Cloud Function para processar a saída de nota fiscal
// Substitua 'your-region' e 'your-project-id' conforme sua configuração
const CF_URL_SAIDA =
  "https://your-region-your-project-id.cloudfunctions.net/processarSaidaNota";

// Função para adicionar um novo item à nota de saída
function adicionarItemSaida() {
  const container = document.getElementById("itens-saida-container");

  const divItem = document.createElement("div");
  divItem.classList.add("item-bloco", "mb-3");
  divItem.innerHTML = `
    <div class="row g-2">
      <div class="col-md-5">
        <input type="text" class="form-control item-nome" placeholder="Nome do item" required>
      </div>
      <div class="col-md-3">
        <input type="number" class="form-control item-quantidade" placeholder="Quantidade" required>
      </div>
      <div class="col-md-3">
        <input type="number" step="0.01" class="form-control item-valor" placeholder="Valor Unitário" required>
      </div>
      <div class="col-md-1">
        <button type="button" class="btn btn-danger btn-remover">X</button>
      </div>
    </div>
  `;
  container.appendChild(divItem);

  // Evento para remover o item
  divItem.querySelector(".btn-remover").addEventListener("click", () => {
    container.removeChild(divItem);
  });
}

// Evento para o botão "Adicionar Item"
document
  .getElementById("btn-adicionar-item-saida")
  .addEventListener("click", adicionarItemSaida);

// Função para enviar a nota de saída
async function enviarSaidaNota(e) {
  e.preventDefault();

  // Coleta dos dados da nota de saída
  const numeroNFSaida = document.getElementById("numeroNFSaida").value.trim();
  const destinatario = document.getElementById("destinatario").value.trim();
  const dataSaida = document.getElementById("dataSaida").value;

  // Coleta dos itens
  const itens = [];
  const itemBlocos = document.querySelectorAll(".item-bloco");
  itemBlocos.forEach((bloco) => {
    const nome = bloco.querySelector(".item-nome").value.trim();
    const quantidade = parseInt(bloco.querySelector(".item-quantidade").value);
    const valor = parseFloat(bloco.querySelector(".item-valor").value);
    if (nome && quantidade && !isNaN(valor)) {
      itens.push({ nome, quantidade, valor_unitario: valor });
    }
  });

  if (itens.length === 0) {
    alert("Adicione pelo menos um item.");
    return;
  }

  // Obter o unitId a partir da URL
  const urlParams = new URLSearchParams(window.location.search);
  const unitId = urlParams.get("id");
  if (!unitId) {
    alert("Unidade não identificada.");
    return;
  }

  // Monta o objeto da nota de saída
  const saidaData = {
    unitId,
    numero_nf: numeroNFSaida,
    dados_nota: {
      destinatario,
      dataSaida,
    },
    itens,
  };

  try {
    const response = await fetch(CF_URL_SAIDA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saidaData),
    });
    const result = await response.json();
    if (response.ok) {
      document.getElementById(
        "msg-saida"
      ).innerHTML = `<div class="alert alert-success">${result.message}</div>`;
      document.getElementById("form-saida-nota").reset();
      document.getElementById("itens-saida-container").innerHTML = "";
    } else {
      throw new Error(result.error || "Erro no processamento da saída.");
    }
  } catch (error) {
    console.error("Erro ao enviar saída de nota:", error);
    document.getElementById(
      "msg-saida"
    ).innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
  }
}

document
  .getElementById("form-saida-nota")
  .addEventListener("submit", enviarSaidaNota);
