const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

//image test path
const testImagePath = path.join(__dirname, '..', 'AItestdata','gazelle', 'gazelle2.jpeg');

//training labels
const labels = ['addax', 'crane','falcon','gazelle','tortoise']; 

const loadAndPreprocessImage = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const imageTensor = tf.node.decodeImage(buffer, 3)
    .resizeNearestNeighbor([128, 128])
    .toFloat()
    .div(255.0)
    .expandDims(); 
  return imageTensor;
};

const predictImage = async () => {
  // 1. Load the model
  const model = await tf.loadLayersModel('file://' + path.join(__dirname, '..', 'AIdata', 'model.json'));

  // 2. Load and preprocess image
  const input = loadAndPreprocessImage(testImagePath);

  // 3. Predict
  const prediction = model.predict(input);
  const predictionData = await prediction.data();
  const predictedIndex = predictionData.indexOf(Math.max(...predictionData));

  console.log(`🧠 Prediction: ${labels[predictedIndex]} (${(predictionData[predictedIndex] * 100).toFixed(2)}%)`);
};

predictImage();
