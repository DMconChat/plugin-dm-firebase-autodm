const admin = require("firebase-admin");
const express = require("express");
const app = express();
app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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

// Crear o actualizar personaje
app.post("/personaje/:campañaId", async (req, res) => {
  const { nombre, datos } = req.body;
  try {
    const ref = db.collection("campañas").doc(req.params.campañaId);
    await ref.update({
      [`personajes.${nombre}`]: datos
    });
    res.send("Personaje creado o actualizado.");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Registrar evento en bitácora
app.post("/bitacora/:campañaId", async (req, res) => {
  const { timestamp, tipo, detalle, origen } = req.body;
  try {
    const ref = db.collection("
