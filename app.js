const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'root',
      database: 'classlist_db'
    },
    console.log(`Connected to the classlist_db database.`)
  );


  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  