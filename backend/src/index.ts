import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from the React app build
app.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

// Dummy data storage
const users = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: '$2b$12$i4S8hay.bFfh8ACXoxePF.PkpjTZV4VKSBojXYI39XJzyFzWPTwdO' // password: test123
  }
];

const tasks = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the todo app project',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-15',
    categories: ['work', 'documentation'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    userId: '1'
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and vegetables',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-01-12',
    categories: ['personal', 'shopping'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    userId: '1'
  },
  {
    id: '3',
    title: 'Review pull requests',
    description: 'Review 3 pending PRs for the team',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-01-11',
    categories: ['work', 'code-review'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-11T15:30:00Z',
    userId: '1'
  },
  {
    id: '4',
    title: 'Exercise',
    description: '30 minutes cardio workout',
    priority: 'low',
    status: 'deferred',
    dueDate: '2024-01-13',
    categories: ['health', 'fitness'],
    createdAt: '2024-01-10T07:00:00Z',
    updatedAt: '2024-01-10T07:00:00Z',
    userId: '1'
  }
];

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/signup', async (req: any, res: any) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      name,
      password: hashedPassword
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Task routes
app.get('/api/tasks', authenticateToken, (req: any, res: any) => {
  const userTasks = tasks.filter((task: any) => task.userId === req.user.id);
  res.json(userTasks);
});

app.post('/api/tasks', authenticateToken, (req: any, res: any) => {
  try {
    const { title, description, priority, dueDate, categories } = req.body;

    const newTask = {
      id: (tasks.length + 1).toString(),
      title,
      description,
      priority: priority || 'medium',
      status: 'pending',
      dueDate,
      categories: categories || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: req.user.id
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/api/tasks/:id', authenticateToken, (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const taskIndex = tasks.findIndex((task: any) => task.id === taskId && task.userId === req.user.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex((task: any) => task.id === taskId && task.userId === req.user.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Health check
app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'OK', message: 'Todo app backend is running' });
});

// Serve React app for any non-API routes
function serveIndexHtml(req: any, res: any) {
  const indexPath = path.resolve(__dirname, '../../frontend/dist/index.html');
  console.log('Resolved index.html path:', indexPath);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('index.html not found at ' + indexPath);
  }
}

app.get('/', serveIndexHtml);
app.get('/login', serveIndexHtml);
app.get('/signup', serveIndexHtml);
app.get('/dashboard', serveIndexHtml);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Test user: test@example.com / test123`);
  console.log(`🌐 Frontend served at: http://localhost:${PORT}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
}); 