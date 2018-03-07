const { Router } = require('express');
const client = require('../../index');

const router = Router()
  .get('/', (req, res) => {
    res.render('admin.pug');
  })
  .post('/sendArticle', async (req, res) => {
    if (req.isAuthenticated()) {
      if (client.config.owners.includes(req.user.id)) {
        client.database.insertDocument('articles', {
          title: req.body.title,
          content: req.body.content,
          published: Date.now(),
          lastEdit: null,
          author: req.user.id,
        });

        res.redirect('/admin');
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(401);
    }
  });

module.exports = router;
