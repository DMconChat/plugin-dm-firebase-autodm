const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// Servir archivos estáticos como ai-plugin.json y openapi.json
app.use(express.static(path.join(__dirname)));

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase inicializado correctamente.");
} catch (error) {
  console.error("❌ ERROR al inicializar Firebase:", error.message);
}

const db = admin.apps.length ? admin.firestore() : null;

// Prueba simple
app.get("/test", (req, res) => {
  res.send("Servidor activo y sin errores.");
});

// Endpoint de prueba en Firebase
app.get("/ping", async (req, res) => {
  if (!db) return res.status(500).send("Firebase no inicializado");
  try {
    const snapshot = await db.collection("test").limit(1).get();
    res.send("Firebase responde.");
  } catch (err) {
    res.status(500).send("Error consultando Firebase: " + err.message);
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔥 Servidor corriendo en el puerto", PORT);
});
