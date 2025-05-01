const admin = require("firebase-admin");
const express = require("express");
const app = express();
app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://TU_PROYECTO.firebaseio.com"
});

const db = admin.firestore();

// INFO para el Dungeon Master IA
app.get("/dm-info", (req, res) => {
  res.json({
    estructura: "campañas/{id}/[personajes, sesiones, objetos, eventosGlobales, bitacora]",
    comandos: ["crear-personaje", "registrar-evento", "actualizar-personaje", "buscar"],
    registro: "usa /bitacora para guardar cada mensaje",
    notas: "toda entrada debe incluir campañaId y timestamp"
  });
});

// Crear campaña
app.post("/crear-campaña", async (req, res) => {
  const { campañaId, infoGeneral } = req.body;
  try {
    await db.collection("campañas").doc(campañaId).set({
      infoGeneral,
      sesiones: [],
      personajes: {},
      facciones: {},
      lugares: {},
      objetos: {},
      eventosGlobales: [],
      bitacora: []
    });
    res.status(201).send("Campaña creada.");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Otros endpoints omitidos aquí por espacio: serán incluidos en el ZIP

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(Servidor activo en el puerto ${PORT});
});
