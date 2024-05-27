const Info = require("../models/info");
// const ort = require('onnxruntime-node');

const modelPath = "path/to/your/model.onnx";

exports.createInfo = async (req, res) => {
  const { name, age, weight, height, gender } = req.body;
  const newInfo = new Info({
    userId: req.userId,
    name,
    age,
    weight,
    height,
    gender,
  });

  try {
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getInfos = async (req, res) => {
  try {
    const infos = await Info.find({ userId: req.userId });
    res.json(infos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const { name, age, weight, height, gender } = req.body;
    const updatedInfo = await UserInfo.findByIdAndUpdate(
      req.params.id,
      { name, age, weight, height, gender },
      { new: true }
    );
    res.status(200), json(updatedInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteInfo = async (req, res) => {
  try {
    const info = await Info.findByIdAndDelete(req.params.id);
    if (!info) return res.status(404).json({ message: "Info not found" });
    res.json({ message: "Info deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.predictDiabetes = async (req, res) => {
  try {
    res.json({ diabetes_probability: 0.2 });
  } catch (error) {
    console.error("Error running the ONNX model", error);
    res.status(500).json({ message: "Server error" });
  }
  /*
  const { age, weight, height, gender } = req.body;
  
  // Gender encoding: Assuming 0 for male, 1 for female, etc.
  const genderEncoded = gender.toLowerCase() === 'male' ? 0 : 1;

  
  // Prepare the input data for the model
  const inputData = [parseFloat(age), parseFloat(weight), parseFloat(height), genderEncoded];

  try {
    // Load the ONNX model
    const session = await ort.InferenceSession.create(modelPath);

    // Prepare the feeds for input
    const tensor = new ort.Tensor('float32', Float32Array.from(inputData), [1, 4]);
    const feeds = { float_input: tensor };

    // Run the model
    const results = await session.run(feeds);
    const prediction = results.probability.data[0]; // Adjust output key based on your model

    res.json({ diabetes_probability: prediction });
  } catch (error) {
    console.error('Error running the ONNX model', error);
    res.status(500).json({ message: 'Server error' });
  }
  */
};
