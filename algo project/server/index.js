const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');
const Task = require('./models/Task');
const Habit = require('./models/Habit');
const User = require('./models/User');
const { authenticateToken, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = await User.create({ email, password, name });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({ 
      where: { userId: req.user.id },
      order: [['dueDate', 'ASC']] 
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/habits', authenticateToken, async (req, res) => {
  try {
    const habits = await Habit.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']] 
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/habits', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.create({
      ...req.body,
      userId: req.user.id
    });
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    await habit.update(req.body);
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/habits/:id/complete', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    
    const today = new Date().toISOString().split('T')[0];
    if (habit.lastCompletedDate === today) {
      return res.json(habit);
    }
    
    await habit.update({
      streak: habit.streak + 1,
      lastCompletedDate: today
    });
    
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    await habit.destroy();
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
