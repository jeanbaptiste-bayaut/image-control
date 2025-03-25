import express from 'express';
import 'dotenv/config';
import path from 'path';
import { createServer } from 'http';
import MainController from './api/mainController.js';
import cors from 'cors';
import upload from './api/middleware/multerConfig.js';
import fs from 'fs';
import { logWritter } from './api/middleware/logWritter.js';

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://image-control-6ev9.onrender.com/',
    'http://localhost:8080',
  ],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);

const __dirname = path.resolve(); // ES6

app.use(express.static(path.join(__dirname, './dist')));

app.get('/api/products', (req, res) => {
  MainController.getProducts(req, res);
});

app.post('/api/products/status', logWritter, (req, res) => {
  MainController.setProductStatus(req, res);
});

app.post('/api/products/observations', logWritter, (req, res) => {
  MainController.writeObservations(req, res);
});

app.get('/api/products/observations', (req, res) => {
  MainController.getObservations(req, res);
});

app.post('/api/products/list', upload.single('file'), (req, res) => {
  MainController.uploadFile(req, res);
});

app.get('/api/logs', (req, res) => {
  res.sendFile(path.join(__dirname, '/api/logs', 'app.log'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

const PORT = process.env.ENV == 'DEV' ? 6464 : process.env.PORT;

httpServer.listen(PORT, () => {
  const dir = path.join(__dirname, 'uploads');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log('Uploads directory created');
  }

  console.log(`Server launched at http://localhost:${PORT}`);
});
