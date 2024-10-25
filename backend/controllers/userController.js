const db = require('../config/db');

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, role } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?';
  db.query(sql, [name, email, phone, role, userId], (err, results) => {
    if (err) throw err;
    res.json({ msg: 'User updated successfully' });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) throw err;
    res.json({ msg: 'User deleted successfully' });
  });
};
