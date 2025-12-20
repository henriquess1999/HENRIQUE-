/*
Script para definir custom claim `admin=true` em um usuário Firebase Auth.
Uso:
  node set-admin-claim.js --email user@example.com
ou
  node set-admin-claim.js --uid USER_UID

Requisitos:
- Ter um arquivo de chave de serviço do Firebase (Service Account JSON).
- Exportar a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS apontando para esse arquivo, ou alterar o caminho abaixo.
- Instalar dependência: npm install firebase-admin
*/

const admin = require('firebase-admin');
const argv = require('minimist')(process.argv.slice(2));

if (!argv.email && !argv.uid) {
  console.error('Erro: forneça --email ou --uid');
  process.exit(1);
}

// Opcional: caminho direto para o service account (descomente se quiser fixar)
// const serviceAccount = require('../path/to/serviceAccountKey.json');
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Usa a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS por padrão
try {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
} catch (err) {
  console.error('Erro ao inicializar Firebase Admin:', err.message);
  process.exit(1);
}

async function setAdminByEmail(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Custom claim admin=true adicionada para ${email} (uid=${user.uid})`);
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
}

async function setAdminByUid(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Custom claim admin=true adicionada para uid=${uid}`);
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
}

(async () => {
  if (argv.email) await setAdminByEmail(argv.email);
  if (argv.uid) await setAdminByUid(argv.uid);
  // Opcional: force refresh token instruction
  console.log('Observação: o usuário pode precisar fazer logout/login para ver a claim atualizada.');
  process.exit(0);
})();
