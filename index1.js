const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
// const bcrypt = require('bcrypt');
const app = express();
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views',path.join(__dirname,''));

// Create a MySQL connection
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Ankeet@1234",
     database:'studentdb'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // SQL command to create a table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS my_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      password varchar(255),
      phone_number VARCHAR(15)
    )
  `;

  // Execute the CREATE TABLE command
  connection.query(createTableSQL, (err, results) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table created successfully');
    }
  });
});

// Serve the HTML form using EJS
app.get('/', (req, res) => {
    // res.send(`<html>
    // <body>
    //     <h1>Submit a Form</h1>
    //     <form action="/submit" method="post">
    //         <label for="name">Name:</label>
    //         <input type="text" id="name" name="name" required><br><br>
    
    //         <label for="email">Email:</label>
    //         <input type="email" id="email" name="email" required><br><br>
    
    //         <input type="submit" value="Submit">
    //     </form>
    // </body>
    // </html>`);
    //res.sendFile('/form.html', { root: __dirname });
     res.render('index');
});

app.get('/log',(req,res)=>{
  res.render('index1');
})

// Handle form submissions
app.post('/submit', (req, res) => {
  // const { name, email } = req.body;
  const { name, email,password,number} = req.body;

  // Insert form data into the MySQL table
  const insertDataSQL = 'INSERT INTO my_table (name, email,password,  phone_number) VALUES (?, ?,?,?)';
  const data = [name, email,password,number];

  connection.query(insertDataSQL, data, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.sendStatus(500);
    } else {
      console.log('Data inserted successfully');
//       res.send(`<html>
//       <body>
//     <h1>Form Submitted</h1>
//     <p>Thank you for submitting the form!</p>
// </body></html>`)// Render a confirmation view (e.g., confirmation.ejs)
res.render('confirmation',{submitted:true});
    }
  });
});

const query='SELECT * FROM my_table';
// const query='SELECT name FROM my_table';

 app.get('/data', (req,res)=>{
 connection.query(query,(err,result)=>{
   if(err) {console.error('Error inserting data:', err);
   res.sendStatus(500).send(err);
 }
 else{
  res.json(result);
  //console.log(result);
 }
 })
 })

 app.post('/login', (req, res) => {
  const email = req.body.email;
  const password= req.body.password;

  const sql = 'SELECT * FROM my_table WHERE email = ? AND password = ?';
  connection.query(sql, [ email,password], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          //res.send('User logged in successfully.');
          console.log(results.length);
          console.log(password);
          console.log(email);
          console.log(results);  
          res.render('confirmation',{submitted:true});  

      } else {
          res.send('Invalid username or password.');
          console.log(results.length);
          console.log(password);
          console.log(email);
          console.log(results);  
      }
  });
});


app.listen(8080, () => {
  console.log(`Server is running `);
});