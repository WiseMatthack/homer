const { Router } = require('express');
const client = require('../../index');

const articles = require('./admin/articles');

const router = Router()
  .use((req, res, next) => {
    if (req.isAuthenticated() && client.config.owners.includes(req.user.id)) return next();
    else return res.render('error.pug', { errorCode: '403' });
  })
  .use('/articles', articles)
  .get('/', (req, res) => {
    res.render('admin.pug');
  });

module.exports = router;
