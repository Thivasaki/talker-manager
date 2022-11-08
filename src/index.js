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

app.post('/login', (req, res) => {
  const token = genereteToken();
  return res.status(200).json({ token });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
