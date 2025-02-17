// js/funcionarios.js

const db = firebase.firestore();

async function carregarFuncionarios() {
  try {
    const snapshot = await db
      .collection("funcionarios")
      .orderBy("dataCadastro", "desc")
      .get();
    let html = `<table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Matrícula</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>`;
    snapshot.forEach((doc) => {
      const data = doc.data();
      html += `<tr>
                 <td>${data.matricula}</td>
                 <td>${data.nome}</td>
                 <td>${data.email}</td>
                 <td>
                   <button class="btn btn-sm btn-warning" onclick="editarFuncionario('${doc.id}')">Editar</button>
                   <button class="btn btn-sm btn-danger" onclick="excluirFuncionario('${doc.id}')">Excluir</button>
                 </td>
               </tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById("lista-funcionarios").innerHTML = html;
  } catch (error) {
    console.error("Erro ao carregar funcionários:", error);
    alert("Erro ao carregar a lista de funcionários.");
  }
}

async function salvarFuncionario(e) {
  e.preventDefault();

  const matricula = document.getElementById("matricula").value.trim();
  const nome = document.getElementById("nomeFuncionario").value.trim();
  const email = document.getElementById("emailFuncionario").value.trim();
  const senha = document.getElementById("senhaFuncionario").value.trim();

  const funcionarioData = {
    matricula,
    nome,
    email,
    senha, // A senha padrão é a mesma que a matrícula, podendo ser alterada posteriormente
    dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const funcionarioId = document
    .getElementById("matricula")
    .getAttribute("data-id");

  try {
    if (funcionarioId) {
      await db
        .collection("funcionarios")
        .doc(funcionarioId)
        .update(funcionarioData);
      alert("Funcionário atualizado com sucesso!");
    } else {
      await db.collection("funcionarios").add(funcionarioData);
      alert("Funcionário cadastrado com sucesso!");
    }
    var modalElement = document.getElementById("modal-funcionario");
    var modal =
      bootstrap.Modal.getInstance(modalElement) ||
      new bootstrap.Modal(modalElement);
    modal.hide();
    document.getElementById("form-funcionario").reset();
    carregarFuncionarios();
  } catch (error) {
    console.error("Erro ao salvar funcionário:", error);
    alert("Erro ao salvar funcionário.");
  }
}

async function editarFuncionario(funcionarioId) {
  try {
    const doc = await db.collection("funcionarios").doc(funcionarioId).get();
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("matricula").value = data.matricula;
      document
        .getElementById("matricula")
        .setAttribute("data-id", funcionarioId);
      document.getElementById("nomeFuncionario").value = data.nome;
      document.getElementById("emailFuncionario").value = data.email;
      document.getElementById("senhaFuncionario").value = data.senha;

      var modalElement = document.getElementById("modal-funcionario");
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  } catch (error) {
    console.error("Erro ao editar funcionário:", error);
    alert("Erro ao carregar dados do funcionário.");
  }
}

async function excluirFuncionario(funcionarioId) {
  if (confirm("Deseja realmente excluir este funcionário?")) {
    try {
      await db.collection("funcionarios").doc(funcionarioId).delete();
      alert("Funcionário excluído com sucesso!");
      carregarFuncionarios();
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      alert("Erro ao excluir funcionário.");
    }
  }
}

document
  .getElementById("form-funcionario")
  .addEventListener("submit", salvarFuncionario);

window.onload = carregarFuncionarios;
