//Importation des modules

const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

//Crée un router Express et importe le modèle MongoDB pour enregistrer les prédictions.
const router = express.Router();
const Prediction = require('../models/AIagent'); 

//Labels et configuration du stockage

//Liste des classes que ton modèle peut prédire.
const labels = ['addax', 'crane', 'falcon', 'gazelle', 'tortoise'];

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Prétraitement de l’image
//charger et normaliser une image en tenseur pour la prédiction : Une image en tenseur est
//simplement une représentation numérique d'une image sous forme de tableau multidimensionnel.
//Les modèles de deep learning ne comprennent pas les images JPEG ou PNG directement. 
// Ils ont besoin de tenseurs normalisés (valeurs entre 0 et 1).
//C’est une dimension supplémentaire qu’on ajoute au tenseur d'image pour représenter un groupe d’images


const loadAndPreprocessImage = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const imageTensor = tf.node.decodeImage(buffer, 3)
    .resizeNearestNeighbor([128, 128]) //redimensionnée à 128×128
    .toFloat()
    .div(255.0) //valeurs entre 0 et 1
    .expandDims(); //ajout d'une dimension batch
  return imageTensor;
};

router.post('/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    console.log('❌ No file received');
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  try {
    console.log('📷 File uploaded:', req.file.path);
//Chargement du modèle & prédiction
    const modelPath = path.join(__dirname, '..', 'AIdata', 'model.json');
    const model = await tf.loadLayersModel('file://' + modelPath);
    console.log('✅ Model loaded');
//Applique ton modèle à l’image, puis extrait les valeurs de probabilité.
    const input = loadAndPreprocessImage(req.file.path);
    const prediction = model.predict(input);
    const predictionData = await prediction.data();
// Détermine la classe la plus probable et son pourcentage.
    const maxConfidence = Math.max(...predictionData);
const predictedIndex = predictionData.indexOf(maxConfidence);
const confidencePercent = maxConfidence * 100;
console.log(`🎯 Confidence: ${confidencePercent.toFixed(2)}%`);

//Réponse basée sur la confiance
let response;

if (confidencePercent < 70) {
  response = {
    name: 'unknown object or animal not labeled',
    endangered: false,
    location: 'Unknown',
  };
} else {
  const predictedLabel = labels[predictedIndex];
  response = {
    name: predictedLabel,
    endangered: ['addax', 'crane', 'falcon', 'gazelle', 'tortoise'].includes(predictedLabel),
    location: getAnimalLocation(predictedLabel),
  };

  // Save only if prediction is confident
  const newPrediction = new Prediction({
    speciesName: response.name,
    location: response.location,
    endangered: response.endangered,
  });

  await newPrediction.save();
  console.log('✅ Prediction saved to MongoDB');
}


    // Save prediction to MongoDB
    const newPrediction = new Prediction({
      speciesName: response.name,
      location: response.location,
      endangered: response.endangered,
    });

    await newPrediction.save();
    console.log('✅ Prediction saved to MongoDB');

    fs.unlinkSync(req.file.path); // Clean up the uploaded file

    console.log('✅ Prediction success:', response);
    res.json(response);
  } catch (err) {
    console.error('❌ Prediction error:', err);
    res.status(500).json({ error: 'Prediction failed. Check server logs.' });
  }
});

function getAnimalLocation(animal) {
  switch (animal) {
    case 'addax':
      return 'North Africa';
    case 'crane':
      return 'Europe/Asia/Africa';
    case 'falcon':
      return 'Worldwide';
    case 'gazelle':
      return 'Africa';
    case 'tortoise':
      return 'Africa/Asia';
    default:
      return 'Unknown';
  }
}

module.exports = router;
