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

module.exports = {
  validateEmail,
  validateEmailSyntax,
  validatePassword,
  validatePasswordLength,
  validateToken,
  validateTokenSyntax,
  validateName,
  validateNameLength,
  validateAge,
  validateAgeMajority,
  validateTalk,
  validateWatchedAt,
  validateWatchAtSyntax,
  validateRate,
  validateRateValue,
};