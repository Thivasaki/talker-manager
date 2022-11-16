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
    return next();
  }
  res.status(400).send({ message: 'O campo "email" é obrigatório',
});
}

function validateEmailSyntax(req, res, next) {
  const regex = /\S+@\S+\.\S+/;
  if (regex.test(req.body.email)) {
    return next();
  }
  res.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
}

function validatePassword(req, res, next) {
  if (req.body.password) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "password" é obrigatório',
  });
}

function validatePasswordLength(req, res, next) {
  if (req.body.password.length >= 6) {
    return next();
  }
  res.status(400).send({
    message: 'O "password" deve ter pelo menos 6 caracteres',
  });
}

function validateToken(req, res, next) {
  if (req.headers.authorization) {
    return next();
  }
  res.status(401).send({
    message: 'Token não encontrado',
  });
}

function validateTokenSyntax(req, res, next) {
  if (req.headers.authorization.length === 16) {
    return next();
  }
  res.status(401).send({
    message: 'Token inválido',
  });
}

function validateName(req, res, next) {
  if (req.body.name) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "name" é obrigatório',
  });
}

function validateNameLength(req, res, next) {
  if (req.body.name.length >= 3) {
    return next();
  }
  res.status(400).send({
    message: 'O "name" deve ter pelo menos 3 caracteres',
  });
}

function validateAge(req, res, next) {
  if (req.body.age) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "age" é obrigatório',
  });
}

function validateAgeMajority(req, res, next) {
  if (req.body.age >= 18) {
    return next();
  }
  res.status(400).send({
    message: 'A pessoa palestrante deve ser maior de idade',
  });
}

function validateTalk(req, res, next) {
  if (req.body.talk) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "talk" é obrigatório',
  });
}

function validateWatchedAt(req, res, next) {
  if (req.body.talk.watchedAt) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "watchedAt" é obrigatório',
  });
}

function validateWatchAtSyntax(req, res, next) {
const regex = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;
  if (regex.test(req.body.talk.watchedAt)) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
  });
}

function validateRate(req, res, next) {
  if (req.body.talk.rate !== undefined) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "rate" é obrigatório',
  });
}

function validateRateValue(req, res, next) {
  const { rate } = req.body.talk;
  if (rate <= 5 && rate >= 1 && rate % 1 === 0) {
    return next();
  }
  res.status(400).send({
    message: 'O campo "rate" deve ser um inteiro de 1 à 5',
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

async function writeData(newData) {
  try {
    const oldData = await readData();
    const id = oldData.length + 1;
    const newDataWithId = { id, ...newData };
    const allData = JSON.stringify([...oldData, newDataWithId]);
    await fs.writeFile(path.resolve(__dirname, './talker.json'), allData);
    return newDataWithId;
  } catch (error) {
    console.error(`Erro na escrita dos dados:${error}`);
  }
}

async function updateData(id, patchedData) {
  const oldData = await readData();
  const pacthData = { id, ...patchedData };
  const updateTalker = oldData.map((data) => (data.id === id 
  ? pacthData : data));
  const updateTalkerData = JSON.stringify(updateTalker);
  try {
    await fs.writeFile(path.resolve(__dirname, './talker.json'), updateTalkerData);
    return pacthData;
  } catch (error) {
    console.error(`Erro na escrita dos dados:${error}`);
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

app.post('/talker', validateToken, validateTokenSyntax,
validateName, validateNameLength, validateAge, validateAgeMajority,
validateTalk, validateWatchedAt, validateWatchAtSyntax,
validateRate, validateRateValue, async (req, res) => {
  const newTalker = req.body;
  const newListTalker = await writeData(newTalker);
  res.status(201).json(newListTalker);
});

app.put('/talker/:id', validateToken, validateTokenSyntax,
validateName, validateNameLength, validateAge, validateAgeMajority,
validateTalk, validateWatchedAt, validateWatchAtSyntax,
validateRate, validateRateValue, async (req, res) => {
  const id = Number(req.params.id);
  console.log(req.body);
  const pacthData = await updateData(id, req.body);
  res.status(HTTP_OK_STATUS).json(pacthData);
});

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
