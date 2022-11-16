const fs = require('fs').promises;
const path = require('path');

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

async function deleteData(id) {
  const oldData = await readData();
  const deleteTalker = oldData.filter((talker) => talker.id !== id);
  const deletedTalkerData = JSON.stringify(deleteTalker);
  try {
    await fs.writeFile(path.resolve(__dirname, './talker.json'), deletedTalkerData);
  } catch (error) {
    console.error(`Erro na escrita dos dados:${error}`);
  }
}

module.exports = {
  readData,
  writeData,
  updateData,
  deleteData,
};