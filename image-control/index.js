import express from 'express';
import 'dotenv/config';
import path from 'path';
import { createServer } from 'http';
import MainController from './api/mainController.js';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173',
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

app.post('/api/products/status', (req, res) => {
  MainController.setProductStatus(req, res);
});

app.post('/api/products/observations', (req, res) => {
  MainController.writeObservations(req, res);
});

app.get('/api/products/observations', (req, res) => {
  MainController.getObservations(req, res);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server launched at http://localhost:${PORT}`);
});
