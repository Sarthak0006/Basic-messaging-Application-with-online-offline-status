const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = 'your_jwt_secret';

exports.register = (req, res) => {
  const { name, email, phone, role, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      const sql = 'INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [name, email, phone, role, hash], (err, result) => {
        if (err) throw err;
        res.status(201).json({ msg: 'User registered successfully' });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
};
