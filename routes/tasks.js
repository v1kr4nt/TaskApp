const express = require("express");
const router = express.Router();

const Task = require("../models/task");

//get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add new task
router.post("/addtask", async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const newTask = await task.save();
    res.status(200).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//middleware for :id route
async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.task = task;
  next();
}

//get a specific task
router.get("/gettask/:id", getTask, (req, res) => {
  res.json(res.task);
});

// update specific task
router.patch("/updatetask/:id", getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }
  if (req.body.description != null) {
    res.task.description = req.body.description;
  }
  try {
    const updateTask = await res.task.save();
    res.json(updateTask);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//delete a task by id

router.delete("/deletask/:id", getTask, async (req, res) => {
  try {
    await res.task.deleteOne();
    res.json({ message: "task deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
