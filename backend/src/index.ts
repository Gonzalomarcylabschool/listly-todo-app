import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import pool from './db';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from the React app build
app.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

// Route to test the database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connection successful!',
      time: rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Database connection failed',
      details: (err as Error).message,
    });
  }
});

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET is not defined' });
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
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUserResult = await pool.query(
      'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, name, hashedPassword]
    );
    const newUser = newUserResult.rows[0];

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
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];

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
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Task routes
app.get('/api/tasks', authenticateToken, async (req: any, res: any) => {
  try {
    const userTasksResult = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.id]);
    res.json(userTasksResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

app.post('/api/tasks', authenticateToken, async (req: any, res: any) => {
  try {
    const { title, description, priority, dueDate, categories } = req.body;
    const newTaskResult = await pool.query(
      'INSERT INTO tasks (title, description, priority, due_date, categories, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, priority, dueDate, categories, req.user.id]
    );
    res.status(201).json(newTaskResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/api/tasks/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const { title, description, priority, status, dueDate, categories } = req.body;

    const updatedTaskResult = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4, due_date = $5, categories = $6, updated_at = NOW() WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, description, priority, status, dueDate, categories, taskId, req.user.id]
    );

    if (updatedTaskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or user not authorized' });
    }

    res.json(updatedTaskResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const deleteTaskResult = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, req.user.id]
    );

    if (deleteTaskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or user not authorized' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error(error);
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