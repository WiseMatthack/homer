const { Router } = require('express');
const client = require('../../../index');

const router = Router()
  .use((req, res, next) => {
    if (req.isAuthenticated() && client.config.owners.includes(req.user.id)) return next();
    else return res.render('error.pug', { errorCode: '403' });
  })
  .get('/', async (req, res) => {
    const articles = await client.database.getDocuments('articles');
    res.render('admin_articles.pug', {
      articles,
    });
  })
  .post('/post', async (req, res) => {
    await client.database.insertDocument('articles', {
      title: req.body.title,
      content: req.body.content,
      published: Date.now(),
      lastEdit: null,
      author: req.user.id,
    });

    res.redirect('/admin/articles?success=postedArticle');
  })
  .get('/delete', (req, res) => {
    if (!req.query.id) return res.render('error.pug', { errorCode: '500' });

    client.database.deleteDocument('articles', req.query.id)
      .then(() => res.redirect('/admin/articles?success=deletedArticle'))
      .catch(() => res.render('error.pug', { errorCode: '500' }));
  });

module.exports = router;
