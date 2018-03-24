const { Router } = require('express');
const client = require('../../index');

const articles = require('./admin/articles');
const servers = require('./admin/servers');

const router = Router()
  .use((req, res, next) => {
    if (req.isAuthenticated() && client.config.owners.includes(req.user.id)) return next();
    return res.render('error.pug', { errorCode: '403' });
  })
  .use('/articles', articles)
  .use('/servers', servers)
  .get('/', (req, res) => {
    res.render('admin.pug');
  });

module.exports = router;
