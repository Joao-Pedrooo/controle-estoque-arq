// public/js/admin-unit-login.js

// Obtenha a instância do Firestore (configurada em main.js)
const db = firebase.firestore();

// Lógica para o formulário de login
document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorAlert = document.getElementById("error-alert");

    try {
      // Consulta: busca o documento da unidade onde o admin possui o e-mail informado
      const querySnapshot = await db
        .collection("units")
        .where("admin.email", "==", email)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        throw new Error("E-mail não cadastrado.");
      }

      let unitData = null;
      let unitId = null;
      querySnapshot.forEach((doc) => {
        unitData = doc.data();
        unitId = doc.id;
      });

      // Verifica a senha (atenção: em produção, use senhas criptografadas)
      if (unitData.admin.senha !== password) {
        throw new Error("Senha incorreta.");
      }

      // Se os dados estiverem corretos, redireciona para o painel da unidade com o unitId na URL
      window.location.href = `admin-unit.html?unitId=${unitId}`;
    } catch (error) {
      errorAlert.innerText = error.message;
      errorAlert.style.display = "block";
      setTimeout(() => {
        errorAlert.style.display = "none";
      }, 3000);
    }
  });
