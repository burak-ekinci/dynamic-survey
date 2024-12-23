const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const userRoutes = require("./src/routes/UserRoutes");
const authRoutes = require("./src/routes/authRoutes");
const cors = require("cors");
const authMiddleware = require('./src/middleware/authMiddleware');
const User= require("./src/models/UserModel");
const surveyRoutes = require("./src/routes/surveyRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req,res) => {
    const allUser = await User.findOne({firstName:"emre"})
    res.json({allUser})
})
// app.get("/", async (req,res) => {
// //     const allUser = await User.find()
// //     res.json({allUser})
// // })

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);


console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server ${process.env.PORT || 5000} portunda çalışıyor`);
});
