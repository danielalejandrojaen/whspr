import path from "path";
import { Request, Response } from "express";
import cors from "cors";
const db = require('./db')
const express = require('express');
const session = require('express-session');

const clientPath = path.resolve(__dirname, '../client/dist')

const app = express();
app.use(express.json());
app.use(express.static(clientPath))
app.use(cors());


//MAKE SURE THIS IS LAST
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

module.exports = app;