// public/js/cadastro-unidade.js

// Verifica se o Firebase foi inicializado corretamente
if (!window.db || !window.firebase) {
  console.error("Firebase não foi inicializado corretamente.");
}

const db = window.db;

/**
 * Cria uma nova unidade no Firestore.
 */
const createUnit = (unitData) => {
  console.log("Criando unidade com os dados:", unitData);
  db.collection("units")
    .add(unitData)
    .then((docRef) => {
      console.log("Unidade criada com ID:", docRef.id);
      alert("Unidade cadastrada com sucesso!");
      document.getElementById("form-cadastro-unidade").reset();
    })
    .catch((error) => {
      console.error("Erro ao criar unidade:", error);
      alert("Erro ao cadastrar a unidade: " + error.message);
    });
};

/**
 * Carrega as unidades em tempo real.
 */
const loadUnits = () => {
  db.collection("units")
    .orderBy("dataCadastro", "desc")
    .onSnapshot(
      (snapshot) => {
        let html = `
          <h3>Unidades Cadastradas</h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Localização</th>
                <th>Contrato</th>
                <th>Admin</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
        `;
        snapshot.forEach((doc) => {
          const data = doc.data();
          html += `
            <tr>
              <td>${data.nomeUnidade}</td>
              <td>${data.localizacao}</td>
              <td>${data.contrato}</td>
              <td>${data.admin ? data.admin.nome : ""}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="editUnit('${
                  doc.id
                }')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUnit('${
                  doc.id
                }')">Excluir</button>
              </td>
            </tr>
          `;
        });
        html += `</tbody></table>`;
        const unitsListElement = document.getElementById("units-list");
        if (unitsListElement) {
          unitsListElement.innerHTML = html;
        }
      },
      (error) => {
        console.error("Erro ao carregar unidades:", error);
        const unitsListElement = document.getElementById("units-list");
        if (unitsListElement) {
          unitsListElement.innerHTML = "<p>Erro ao carregar unidades.</p>";
        }
      }
    );
};

/**
 * Exclui uma unidade.
 */
const deleteUnit = (unitId) => {
  if (confirm("Tem certeza que deseja excluir esta unidade?")) {
    db.collection("units")
      .doc(unitId)
      .delete()
      .then(() => alert("Unidade excluída com sucesso!"))
      .catch((error) => {
        console.error("Erro ao excluir unidade:", error);
        alert("Erro ao excluir a unidade: " + error.message);
      });
  }
};

/**
 * Função de edição (apenas exemplo).
 */
const editUnit = (unitId) => {
  db.collection("units")
    .doc(unitId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const unit = doc.data();
        alert("Editar Unidade: " + unit.nomeUnidade);
        // Aqui você pode implementar a lógica de edição, como abrir um modal.
      } else {
        alert("Unidade não encontrada.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar unidade:", error);
      alert("Erro ao buscar dados da unidade: " + error.message);
    });
};

// Associação do envio do formulário de cadastro
document
  .getElementById("form-cadastro-unidade")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeUnidade = document.getElementById("nomeUnidade").value.trim();
    const localizacao = document.getElementById("localizacao").value.trim();
    const contrato = document.getElementById("contrato").value.trim();
    const adminNome = document.getElementById("adminNome").value.trim();
    const adminEmail = document.getElementById("adminEmail").value.trim();
    const adminTelefone = document.getElementById("adminTelefone").value.trim();
    const adminSenha = document.getElementById("adminSenha").value.trim();

    // Verifica se todos os campos estão preenchidos
    if (
      !nomeUnidade ||
      !localizacao ||
      !contrato ||
      !adminNome ||
      !adminEmail ||
      !adminTelefone ||
      !adminSenha
    ) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const unitData = {
      nomeUnidade,
      localizacao,
      contrato,
      admin: {
        nome: adminNome,
        email: adminEmail,
        telefone: adminTelefone,
        senha: adminSenha, // Atenção: em produção, não armazene senhas em texto plano.
      },
      dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
    };

    createUnit(unitData);
  });

// Se o elemento de listagem existir, carrega as unidades ao carregar a página
if (document.getElementById("units-list")) {
  window.addEventListener("load", loadUnits);
}

// Expondo as funções para uso em botões da interface
window.editUnit = editUnit;
window.deleteUnit = deleteUnit;
