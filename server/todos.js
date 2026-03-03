const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: todos, count: todos.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const todo = new Todo({ title: title.trim() });
    const savedTodo = await todo.save();
    res.status(201).json({ success: true, data: savedTodo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/todos/:id - Update a todo (title and/or completed)
router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (completed !== undefined) updateData.completed = completed;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
