// seed.js

// Configura o emulador do Firestore (se estiver testando localmente)
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
console.log("FIRESTORE_EMULATOR_HOST:", process.env.FIRESTORE_EMULATOR_HOST);

// Importa o Firebase Admin SDK
const admin = require("firebase-admin");

// Carrega a chave de serviço (certifique-se de que o arquivo esteja no mesmo diretório ou ajuste o caminho)
const serviceAccount = require("./serviceAccountKey.json");

// Inicializa o Firebase Admin com a chave de serviço
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "estoque-arq-6f373", // Certifique-se de que o projectId está correto
});

// Obtém uma instância do Firestore
const db = admin.firestore();

async function seedDatabase() {
  try {
    process.exit(0);
  } catch (error) {
    console.error("Erro ao seedear o banco:", error);
    process.exit(1);
  }
}

seedDatabase();
