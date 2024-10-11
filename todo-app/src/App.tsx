import React, { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./taskInterface";
import { motion } from "framer-motion";
import { Button, Container, ListGroup, Form } from "react-bootstrap";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // FIND ALL
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

  // CREATE
  const handleCreateTask = async () => {
    if (!newTaskTitle) {
      setError("Title can't be empty");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/tasks", {
        title: newTaskTitle,
        completed: isCompleted,
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setIsCompleted(false);
      setIsCreating(false);
      setNewTaskTitle("");
    } catch (err) {
      console.error(err);
      setError("Can't create task");
    }
  };

  return (
    <Container className="mt-4">
      <h1>Tasks list</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ListGroup className="mb-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.5 }}
          >
            <ListGroup.Item
              key={task._id}
              className="d-flex align-items-center"
            >
              <Form.Check
                type="checkbox"
                className="me-2"
                checked={task.completed}
                readOnly
              />
              {task.title}
            </ListGroup.Item>
          </motion.div>
        ))}
      </ListGroup>

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setIsCreating(!isCreating)}
      >
        {isCreating ? "Stop Creating Task" : "Create Task"}
      </Button>

      {isCreating && (
        <div className="mb-3">
          <Form.Control
            type="text"
            className="mb-2"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Write task title"
          />
          <Form.Check
            type="checkbox"
            label="Completed"
            className="mb-2"
            checked={isCompleted}
            onChange={() => setIsCompleted(!isCompleted)}
          />
          <Button variant="success" onClick={handleCreateTask}>
            Save Task
          </Button>
        </div>
      )}
    </Container>
  );
};

export default App;
