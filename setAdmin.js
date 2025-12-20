// setAdmin.js
// Exemplo para definir custom claim `admin=true` em um usuário Firebase Auth
// Coloque este arquivo fora do front-end (na raiz do projeto backend).

const admin = require("firebase-admin");

// Inicialize o Firebase Admin SDK
// Substitua o caminho pelo seu arquivo Service Account JSON
const serviceAccount = require("./caminho/para/seu/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// UID da conta que você quer tornar admin
const uid = "UID_DO_USUARIO_ADMIN"; // substitua pelo uid real

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Conta ${uid} agora é admin!`);
    process.exit(0);
  })
  .catch(error => {
    console.error("Erro ao definir admin:", error);
    process.exit(1);
  });

// DICA: para verificar a claim no servidor, use:
// admin.auth().getUser(uid).then(u => console.log(u.customClaims)).catch(console.error)
// Lembre o usuário de fazer logout/login para o token do cliente ser atualizado.
