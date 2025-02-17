const admin = require("firebase-admin");

if (process.env.FUNCTIONS_EMULATOR) {
  // Se estiver no emulador, use o arquivo de credenciais
  const serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<seu-projeto>.firebaseio.com",
  });
} else {
  // Em produção, não use o arquivo de credenciais
  admin.initializeApp();
}

const db = admin.firestore();
