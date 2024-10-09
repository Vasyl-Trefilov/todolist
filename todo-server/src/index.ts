import express from "express";
import mongoose from "mongoose";
import Todo from "./models/todo";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения из .env

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1); // Завершаем процесс, если переменная не найдена
}

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB: ", err));

//CREATE NEW TASK
app.post("/tasks", async (req, res) => {
  try {
    const { title, completed } = req.body;
    const task = new Todo({
      title,
      completed: completed || false,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving task", error: (err as Error).message });
  }
});

//GET ALL TASKS
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Todo.find();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error finding tasks", error: (err as Error).message });
  }
});

//START SERVER
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
