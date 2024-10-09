import React, { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./taskInterface";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  //FIND ALL
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:4000/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
        setError("Не удалось загрузить задачи");
      }
    };

    fetchTasks();
  }, []);

  //CREATE
  const handleCreateTask = async () => {
    if (!newTaskTitle) {
      setError("Название задачи не должно быть пустым");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/tasks", {
        title: newTaskTitle,
        completed: isCompleted,
      });
      setTasks((prevtasks) => [...prevtasks, response.data]);
      setIsCompleted(false);
      setIsCreating(false);
      setNewTaskTitle("");
    } catch (err) {
      console.error(err);
      setError("Не удалось create задачи");
    }
  };

  return (
    <div>
      <h1>Список задач</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Отображаем ошибку, если есть */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input type="checkbox" checked={task.completed} readOnly />
            {task.title}
          </li>
        ))}
      </ul>
      <button onClick={() => setIsCreating(!isCreating)}>
        {isCreating ? "Отменить создание задачи" : "Создать задачу"}
      </button>
      {isCreating && (
        <div>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Введите название задачи"
          />
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(!isCompleted)}
          />
          <button onClick={handleCreateTask}>Сохранить задачу</button>
        </div>
      )}
    </div>
  );
};

export default App;
