const db = window.db;
const auth = window.auth;

/**
 * Carrega o dashboard: métricas, listagem de unidades e gráfico.
 */
const loadDashboard = async () => {
  try {
    const unitsSnapshot = await db.collection("units").get();
    document.getElementById("total-unidades").innerText = unitsSnapshot.size;
  } catch (error) {
    console.error("Erro ao carregar total de unidades:", error);
    document.getElementById("total-unidades").innerText = "Erro";
  }

  try {
    const usersSnapshot = await db.collection("funcionarios").get();
    document.getElementById("total-usuarios").innerText = usersSnapshot.size;
  } catch (error) {
    console.error("Erro ao carregar total de usuários:", error);
    document.getElementById("total-usuarios").innerText = "Erro";
  }

  document.getElementById("eventos-analytics").innerText = "-";

  loadUnitsList();
  initializeChart();
};

/**
 * Carrega e exibe a listagem de unidades em tempo real.
 */
const loadUnitsList = () => {
  db.collection("units")
    .orderBy("dataCadastro", "desc")
    .onSnapshot(
      (snapshot) => {
        let html = `
          <h3>Listagem de Unidades</h3>
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
                <button class="btn btn-sm btn-primary" onclick="openEditModal('${
                  doc.id
                }')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUnit('${
                  doc.id
                }')">Excluir</button>
                <a href="admin-unit-login.html?unitId=${
                  doc.id
                }" class="btn btn-sm btn-warning">
                  Links
                </a>
              </td>
            </tr>
          `;
        });
        html += `</tbody></table>`;
        document.getElementById("units-list").innerHTML = html;
      },
      (error) => {
        console.error("Erro ao carregar unidades:", error);
        document.getElementById("units-list").innerHTML =
          "<p>Erro ao carregar unidades.</p>";
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
        alert("Erro ao excluir a unidade.");
      });
  }
};

/**
 * Abre o modal de edição com os dados da unidade selecionada.
 */
const openEditModal = (unitId) => {
  db.collection("units")
    .doc(unitId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const unit = doc.data();
        document.getElementById("edit-unit-id").value = doc.id;
        document.getElementById("edit-nomeUnidade").value = unit.nomeUnidade;
        document.getElementById("edit-localizacao").value = unit.localizacao;
        document.getElementById("edit-contrato").value = unit.contrato;
        document.getElementById("edit-adminNome").value = unit.admin
          ? unit.admin.nome
          : "";
        document.getElementById("edit-adminEmail").value = unit.admin
          ? unit.admin.email
          : "";
        document.getElementById("edit-adminTelefone").value = unit.admin
          ? unit.admin.telefone
          : "";
        document.getElementById("edit-adminSenha").value = unit.admin
          ? unit.admin.senha
          : "";

        const editModal = new bootstrap.Modal(
          document.getElementById("editUnitModal")
        );
        editModal.show();
      } else {
        alert("Unidade não encontrada.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar unidade:", error);
      alert("Erro ao buscar dados da unidade.");
    });
};

/**
 * Salva as alterações feitas no modal de edição.
 */
const saveUnitEdits = (e) => {
  e.preventDefault();
  const unitId = document.getElementById("edit-unit-id").value;
  const updatedData = {
    nomeUnidade: document.getElementById("edit-nomeUnidade").value.trim(),
    localizacao: document.getElementById("edit-localizacao").value.trim(),
    contrato: document.getElementById("edit-contrato").value.trim(),
    admin: {
      nome: document.getElementById("edit-adminNome").value.trim(),
      email: document.getElementById("edit-adminEmail").value.trim(),
      telefone: document.getElementById("edit-adminTelefone").value.trim(),
      senha: document.getElementById("edit-adminSenha").value.trim(),
    },
    dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
  };

  db.collection("units")
    .doc(unitId)
    .update(updatedData)
    .then(() => {
      alert("Unidade atualizada com sucesso!");
      const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById("editUnitModal")
      );
      modalInstance.hide();
    })
    .catch((error) => {
      console.error("Erro ao atualizar unidade:", error);
      alert("Erro ao atualizar a unidade.");
    });
};

document
  .getElementById("edit-unit-form")
  .addEventListener("submit", saveUnitEdits);

/**
 * Faz logout do usuário.
 */
const logout = () => {
  auth
    .signOut()
    .then(() => {
      console.log("Deslogado com sucesso");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Erro ao deslogar:", error);
      alert("Erro ao sair.");
    });
};

document.getElementById("logout-btn").addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});

/**
 * Inicializa o gráfico (dados simulados).
 */
const initializeChart = () => {
  const ctx = document.getElementById("myChart");
  if (!ctx) return;

  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const data = {
    labels,
    datasets: [
      {
        label: "Unidades Criadas",
        data: [10, 15, 8, 20, 12, 18],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "bar",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Unidades Criadas nos Últimos 6 Meses" },
      },
    },
  };

  new Chart(ctx, config);
};

window.addEventListener("load", loadDashboard);
