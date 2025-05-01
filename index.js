const admin = require("firebase-admin");
const express = require("express");
const app = express();
app.use(express.json());

// Clave de Firebase desde variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://TU_PROYECTO.firebaseio.com"
});

const db = admin.firestore();

// Endpoint de autoexplicación para el Dungeon Master IA
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

// Bitácora: registrar acciones
app.post("/bitacora/:campañaId", async (req, res) => {
  const { timestamp, tipo, detalle, origen } = req.body;
  try {
    const ref = db.collection("campañas").doc(req.params.campañaId);
    await ref.update({
      bitacora: admin.firestore.FieldValue.arrayUnion({ timestamp, tipo, detalle, origen })
    });
    res.send("Acción registrada.");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Personaje: crear o actualizar
app.post("/personaje/:campañaId", async (req, res) => {
  const { nombre, datos } = req.body;
  try {
    const ref = db.collection("campañas").doc(req.params.campañaId);
    await ref.update({
      [personajes.${nombre}]: datos
    });
    res.send("Personaje creado o actualizado.");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Evento global
app.post("/evento/:campañaId", async (req, res) => {
  const { fecha, descripcion, consecuencias } = req.body;
  try {
    const ref = db.collection("campañas").doc(req.params.campañaId);
    await ref.update({
      eventosGlobales: admin.firestore.FieldValue.arrayUnion({ fecha, descripcion, consecuencias })
    });
    res.send("Evento global registrado.");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Buscar por palabra clave
app.get("/buscar/:campañaId/:clave", async (req, res) => {
  try {
    const doc = await db.collection("campañas").doc(req.params.campañaId).get();
    const data = JSON.stringify(doc.data());
    const resultado = data.includes(req.params.clave);
    res.json({ encontrado: resultado });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Escuchar en el puerto de Render
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(Servidor activo en el puerto ${PORT});
});
