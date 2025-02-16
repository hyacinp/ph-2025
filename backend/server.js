require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Register new user
app.post('/api/register', async (req, res) => {
  const { firstName, lastInitial, email, pronouns, password } = req.body;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.query(
    'INSERT INTO users (first_name, last_initial, email, pronouns, password) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastInitial, email, pronouns, hashedPassword],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).send('Email already exists');
        }
        console.error('Registration error:', err);
        return res.status(500).send('Error registering user');
      }
      res.status(201).json({ 
        id: results.insertId, 
        firstName, 
        lastInitial, 
        email, 
        pronouns 
      });
    }
  );
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).send('Error during login');
      }
      if (results.length === 0) {
        return res.status(401).send('User not found');
      }
      
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).send('Invalid password');
      }
      
      res.json({
        id: user.id,
        firstName: user.first_name,
        lastInitial: user.last_initial,
        email: user.email,
        pronouns: user.pronouns
      });
    }
  );
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});