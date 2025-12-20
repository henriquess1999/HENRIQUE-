import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Função para adicionar pedido
export async function adicionarPedido(item) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const pedido = {
    userId: user.uid,
    userEmail: user.email,
    item,
    status: "pendente",
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, "pedidos"), pedido);
  return docRef.id;
}

// Função para listar pedidos (Admin ou próprio usuário)
export async function listarPedidos(isAdmin = false) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const pedidosRef = collection(db, "pedidos");
  const snapshot = await getDocs(pedidosRef);
  const pedidos = [];

  snapshot.forEach(doc => {
    const data = doc.data();

    // Se for admin (custom claim) ou isAdmin=true, mostra todos pedidos
    if(isAdmin || user.admin || data.userId === user.uid) {
      pedidos.push({ id: doc.id, ...data });
    }
  });

  return pedidos;
}
