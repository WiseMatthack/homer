const { Router } = require('express');
const client = require('../../index');

const router = Router()
  .use((req, res, next) => {
    if (req.isAuthenticated() && client.config.owners.includes(req.user.id)) return next();
    else return res.render('error.pug', { errorCode: '403' });
  })
  .get('/', (req, res) => {
    res.render('admin.pug');
  })
  .post('/sendArticle', async (req, res) => {
    client.database.insertDocument('articles', {
      title: req.body.title,
      content: req.body.content,
      published: Date.now(),
      lastEdit: null,
      author: req.user.id,
    });

    res.redirect('/admin');
  });

module.exports = router;
