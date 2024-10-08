import React, { useState } from "react";
import { Task } from "./models/Task";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Изучить TypeScript", completed: false },
    { id: 2, title: "Попрактиковаться с React", completed: true },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [correctedTask, setCorrectedTask] = useState("");

  // ADD NEW TASK
  const addTask = () => {
    if (newTaskTitle.trim() === "") return;

    const newTask: Task = {
      id: tasks.length + 1,
      title: newTaskTitle,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  // CHANGE TASK TITLE

  // DELETE TASK
  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // COMPLETED CHANGE
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div>
      <h2>Create new Task:</h2>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Название задачи"
      />
      <button onClick={addTask}>Create</button>

      <h1>Список задач</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              {task.title} {task.completed ? "(выполнено)" : "(не выполнено)"}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
