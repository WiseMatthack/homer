const { Router } = require('express');

const router = Router()
  .get('/', (req, res) => res.render('features.pug'));

module.exports = router;
