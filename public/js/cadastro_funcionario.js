const db = firebase.firestore();

// Obtém o ID da unidade da URL
const urlParams = new URLSearchParams(window.location.search);
const unitId = urlParams.get("unitId");

if (!unitId) {
  alert("Unidade não encontrada.");
  window.location.href = "admin-unit.html";
}

// 📌 Carregar funcionários em tempo real
function loadUsers() {
  db.collection("funcionarios")
    .where("unitId", "==", unitId)
    .onSnapshot((snapshot) => {
      const tableBody = document.getElementById("users-table-body");
      tableBody.innerHTML = "";
      snapshot.forEach((doc) => {
        const func = doc.data();
        tableBody.innerHTML += `
                    <tr>
                        <td>${func.matricula}</td>
                        <td>${func.nome}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="changePassword('${doc.id}')">Senha</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser('${doc.id}')">Excluir</button>
                        </td>
                    </tr>
                `;
      });
    });
}

// 📌 Cadastrar funcionário
document
  .getElementById("createUserForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const senha = document.getElementById("senha").value.trim();

    await db.collection("funcionarios").add({
      nome,
      matricula,
      senha,
      unitId,
    });

    alert("Funcionário cadastrado com sucesso!");
    document.getElementById("createUserForm").reset();
    $("#createUserModal").modal("hide");
  });

// 📌 Abrir modal de alteração de senha
function changePassword(id) {
  document.getElementById("passwordUserId").value = id;
  $("#changePasswordModal").modal("show");
}

// 📌 Atualizar senha do funcionário
document
  .getElementById("changePasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("passwordUserId").value;
    const novaSenha = document.getElementById("newPassword").value.trim();

    await db
      .collection("funcionarios")
      .doc(userId)
      .update({ senha: novaSenha });

    alert("Senha alterada com sucesso!");
    $("#changePasswordModal").modal("hide");
  });

// 📌 Remover funcionário
function deleteUser(id) {
  if (confirm("Tem certeza que deseja excluir este funcionário?")) {
    db.collection("funcionarios").doc(id).delete();
    alert("Funcionário excluído com sucesso!");
  }
}

// 📌 Carregar funcionários ao abrir a página
document.addEventListener("DOMContentLoaded", loadUsers);
