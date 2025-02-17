(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyCAmZ5ngKa4Pk76o-UE3jNeyN-ZoL5Nkeg",
    authDomain: "controle-estoque-arq.firebaseapp.com",
    projectId: "controle-estoque-arq",
    storageBucket: "controle-estoque-arq.firebasestorage.app",
    messagingSenderId: "986364694286",
    appId: "1:986364694286:web:31c29ad76ebb7acb01515f",
    measurementId: "G-GH989WBJ3Y",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  if (["localhost", "127.0.0.1"].includes(location.hostname)) {
    auth.useEmulator("http://127.0.0.1:9099");
    db.useEmulator("127.0.0.1", 8080);
    console.log("Conectado aos emuladores: Auth (9099) e Firestore (8080).");
  }

  // Disponibiliza as instâncias globalmente
  window.auth = auth;
  window.db = db;
  window.firebase = firebase;

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      auth
        .signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
          console.log("Login efetuado com sucesso:", userCredential.user);
          window.location.href = "central-admin-dashboard.html";
        })
        .catch((error) => {
          console.error("Erro no login:", error);
          alert("Erro no login. Verifique seus dados.");
        });
    });
  }
})();
