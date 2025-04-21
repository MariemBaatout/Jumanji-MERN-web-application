const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const imageFolderPath = path.join(__dirname, '..', 'AIdata');

// 🧪 Augment image by flipping, rotating, and adding noise
const augmentImage = (imageTensor) => {
  const batched = imageTensor.expandDims(0); // [1, 128, 128, 3]

  const flipped = tf.image.flipLeftRight(batched);
  const rotated = tf.reverse(tf.transpose(batched, [0, 2, 1, 3]), 2); // Simulate rot90
  const noisy = batched.add(tf.randomNormal(batched.shape, 0, 0.05)).clipByValue(0, 1);

  return [flipped.squeeze(), rotated.squeeze(), noisy.squeeze()];
};

// 🖼️ Load and augment all images
const loadImages = async (basePath) => {
  const labels = fs.readdirSync(basePath);
  const images = [];
  const targets = [];

  for (const labelIndex in labels) {
    const label = labels[labelIndex];
    const files = fs.readdirSync(path.join(basePath, label));

    for (const file of files) {
      const filePath = path.join(basePath, label, file);
      const buffer = fs.readFileSync(filePath);
      const original = tf.node.decodeImage(buffer, 3)
        .resizeNearestNeighbor([128, 128])
        .toFloat()
        .div(255.0);

      const augmented = augmentImage(original);

      for (const augImage of augmented) {
        images.push(augImage.expandDims()); // Make it [1, 128, 128, 3]
        targets.push(Number(labelIndex));
      }
    }
  }

  return {
    xs: tf.concat(images), // [total, 128, 128, 3]
    ys: tf.tensor1d(targets, 'int32')
  };
};

// 🧠 Train the model
const trainModel = async () => {
  const { xs, ys } = await loadImages(imageFolderPath);
  const numClasses = ys.max().dataSync()[0] + 1;
  const ysOneHot = tf.oneHot(ys, numClasses);

  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [128, 128, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.0005),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  await model.fit(xs, ysOneHot, {
    epochs: 20,
    batchSize: 8,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`📈 Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)} acc=${logs.acc.toFixed(4)}`);
      }
    }
  });

  // Save the model
  await model.save('file://' + path.join(__dirname, '..', 'AIdata'));
};

trainModel();
