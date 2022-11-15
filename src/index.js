const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const NOT_FOUND = 404;
const PORT = '3000';

function genereteToken() {
  return crypto.randomBytes(8).toString('hex');
}

function validateEmail(req, res, next) {
  if (req.body.email) {
    next();
  }
  res.status(400).send({ message: 'O campo "email" é obrigatório',
});
}

function validateEmailSyntax(req, res, next) {
  const regex = /\S+@\S+\.\S+/;
  if (regex.test(req.body.email)) {
    next();
  }
  res.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
}

function validatePassword(req, res, next) {
  if (req.body.password) {
    next();
  }
  res.status(400).send({
    message: 'O campo "password" é obrigatório',
  });
}

function validatePasswordLength(req, res, next) {
  if (req.body.password.length >= 6) {
    next();
  }
  res.status(400).send({
    message: 'O "password" deve ter pelo menos 6 caracteres',
  });
}

async function readData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, './talker.json'));
    const talkers = JSON.parse(data);

    return talkers;
  } catch (error) {
    console.error(`Erro de leitura:${error}`);
  }
}

app.get('/talker', async (req, res) => {
  const talkers = await readData();
  return res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (id <= 4) {
    const talkers = await readData();
    const talkerID = talkers.find((e) => e.id === Number(id));
    return res.status(HTTP_OK_STATUS).json(talkerID);
  }
  return res.status(NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validateEmail, validateEmailSyntax,
validatePassword, validatePasswordLength, (req, res) => {
  const token = genereteToken();
  return res.status(200).json({ token });
});

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
