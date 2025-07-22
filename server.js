// there is a bit clutter in the code, be careful if u are trying to understand ,hello from lavishkamboj16@gmail.com

let express = require('express');
let app = express();
let cors = require('cors');
const db = require('./config/db');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./auth');
const JWT_SECRET = "lavish";
require('dotenv').config();
const userTaskModel = require('./models/userTask');

// handling middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://todo-front-bice-six.vercel.app',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/send_inputData', async (req, res) => {
  const token = req.cookies.token;
  let user_name;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    user_name = req.user.user;
    console.log(user_name);

    const { task } = req.body;
    console.log(task);

    await userTaskModel.create({
      task: task,
      username: user_name
    });

    console.log("user registered successfully");
    res.send({ message: 'data transfer successful' });
  } catch (err) {
    console.error('Error in /send_inputData:', err);
    res.status(500).send({ message: 'Something went wrong while saving task data.' });
  }
});

app.get('/auth', auth, (req, res) => {
  try {
    res.send(`Welcome ${req.user.user}`);
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).send({ message: 'Authentication error' });
  }
});

app.get('/getUserData', async (req, res) => {
  const token = req.cookies.token;
  let user_name;

  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    user_name = req.user.user;
    console.log(user_name);

    const user_data = await userTaskModel.find({ username: user_name });
    res.status(200).json(user_data);
  } catch (err) {
    console.error('Error in /getUserData:', err);
    res.status(500).send({ message: 'Failed to fetch user data' });
  }
});

app.get('/log-out', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).send({ message: 'Logout failed' });
  }
});

app.post('/deleteTask', async (req, res) => {
  try {
    console.log(req.body.index);
    await userTaskModel.findByIdAndDelete(req.body.index);
    res.send({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send({ message: 'Failed to delete task' });
  }
});

app.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (user) {
      return res.status(409).send({ message: 'User already exists' });
    }

    const hash_pass = await bcrypt.hash(req.body.password, 10);
    await userModel.create({ username: req.body.username, password: hash_pass });

    const token = jwt.sign({
      user: req.body.username,
      pass: req.body.password
    },process.env.JWT_SECRET);

    console.log("token-" + token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 86400000
    });

    console.log('Cookie being set:', token);

    res.send({ message: 'User successfully signed up' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send({ message: 'Some error occurred' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'User or password is incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'User or password is incorrect' });
    }

    const token = jwt.sign({
      user: username,
      pass: password
    },process.env.JWT_SECRET);

    console.log("token-" + token);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 86400000
    });

    console.log('Cookie being set:', token);

    res.send({ message: 'Login successful', user: { username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Listening at Ptani');
});
