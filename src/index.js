const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const { readData, writeData, updateData, deleteData } = require('./fsUtils');
const { validateAge, validateAgeMajority, validateEmail, validateEmailSyntax,
  validateName, validateNameLength, validatePassword, validatePasswordLength,
  validateRate, validateRateValue, validateTalk, validateToken, validateTokenSyntax,
  validateWatchAtSyntax, validateWatchedAt } = require('./middlewares');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const NOT_FOUND = 404;
const PORT = '3000';

function genereteToken() {
  return crypto.randomBytes(8).toString('hex');
}

app.get('/talker', async (req, res) => {
  const talkers = await readData();
  return res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/search', validateToken, validateTokenSyntax, async (req, res) => {
  const { q } = req.query;
  const talkers = await readData();
  const talkerByName = talkers.filter((talker) => talker.name.includes(q));
  res.status(200).send(talkerByName);
});

app.get('/talker/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (id <= 4) {
    const talkers = await readData();
    const talkerByID = talkers.find((e) => e.id === Number(id));
    return res.status(HTTP_OK_STATUS).json(talkerByID);
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
  const pacthData = await updateData(id, req.body);
  res.status(HTTP_OK_STATUS).json(pacthData);
});

app.delete('/talker/:id', validateToken, validateTokenSyntax, async (req, res) => {
  const id = Number(req.params.id);
  await deleteData(id);
  res.status(204).send();
});

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
