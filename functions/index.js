// functions/index.js

// Importa o Firebase Admin SDK (apenas uma vez)
var admin = require("firebase-admin");

// Carrega a chave de serviço (ajuste o caminho conforme necessário)
var serviceAccount = require("./serviceAccountKey.json");

// Inicializa o Firebase Admin apenas uma vez
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
