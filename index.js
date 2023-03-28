const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //this must when POST method is using form data

// define a route handler for the root URL
app.get('/', (req, res) => {
  // check if the 'username' cookie is set
  console.log('used cookies : ', JSON.stringify(req.cookies));


  if (req.cookies.username) {
    const authStatus = req.cookies.status;
    const username = req.cookies.username;
    console.log(`authStatus : ${authStatus}`);

    if (authStatus == 'true') {
      console.log(`authStatus : ${authStatus}`);
      res.status(200).send(`
                                    <h1> Welcome back ${username} !</h1>
                                    <form action="/logout" method="GET">
                                    <button type="submit">Logout</button>
                                    </form>
                                `);
    } else {
      //Login
      res.send(`
      <h1>Login !</h1>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Enter your username" required>
        <input type="password" name="password" placeholder="Enter your password" required>
        <button type="submit">Login</button>
      </form>
    `);
    }
  } else {
    res.send(`
      <h1>Register !</h1>
      <form action="/home" method="POST">
        <input type="text" name="username" placeholder="Enter your username" required>
        <input type="password" name="password" placeholder="Enter your password" required>
        <button type="submit">Proceed</button>
      </form>
    `);
  }
});

// define a route handler for the '/login' URL
app.post('/login', (req, res) => {
  // get the username from the form data and store it in a cookie
  const { username: un, password: pw } = req.body;
  const { username, password } = req.cookies;

  console.log('logged cookies : ', JSON.stringify(req.cookies));


  if (un == username && pw == password) {
    console.log('username is : ', un);
    res.cookie('username', un); // set the cookie expiration time to 15 minutes
    res.cookie('password', pw);
    res.cookie('status', true);
    res.redirect('/');
  }
  else {
    console.log('incorrect username & password');
    res.send(`
      <h1>Login !</h1>
      <p>Incorrect username or password</p>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Enter your username" required>
        <input type="password" name="password" placeholder="Enter your password" required>
        <button type="submit">Login</button>
      </form>
    `);
  }

});

// define a route handler for the '/logout' URL
app.get('/logout', (req, res) => {
  // clear the 'username' cookie and redirect to the root URL
  console.log('logout cookies : ', JSON.stringify(req.cookies));
  res.cookie('status', false);
  res.redirect('/');
});

app.post('/home', (req, res) => {
  // get the username from the form data and store it in a cookie
  const { username, password } = req.body;
  console.log('home cookies : ', JSON.stringify(req.cookies));
  res.cookie('username', username);
  res.cookie('password', password, { maxAge: 900000 });
  //res.cookie('password', password, { maxAge: 900000 }); // set the cookie expiration time to 15 minutes
  res.cookie('status', true);
  res.redirect("/");
});

app.listen(2000, () => console.log('server started listening on 2000'));