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
      success: req.query.success || false,
    });
  })
  .post('/post', async (req, res) => {
    if (!req.body.title || !req.body.content) return res.render('error.pug', { errorCode: '500' });

    await client.database.insertDocument('articles', {
      title: req.body.title,
      content: req.body.content,
      published: Date.now(),
      lastEdit: null,
      author: req.user.id,
    });

    res.redirect('/admin/articles?success=postedArticle');
  })
  .post('/edit', async (req, res) => {
    if (!req.query.id) return res.render('error.pug', { errorCode: '500' });
    if (!req.body.title || !req.body.content) return res.render('error.pug', { errorCode: '500' });

    client.database.updateDocument('articles', req.query.id, {
      title: req.body.title,
      content: req.body.content,
      lastEdit: Date.now(),
    })
      .then(() => res.redirect('/admin/articles?success=editedArticle'))
      .catch(() => res.render('error.pug', { errorCode: '500' }));
  })
  .get('/edit', async (req, res) => {
    if (!req.query.id) return res.render('error.pug', { errorCode: '500' });

    const article = await client.database.getDocument('articles', req.query.id);
    if (!article) return res.redirect('/admin/articles');

    res.render('admin_articles_edit.pug', {
      article,
    });
  })
  .get('/delete', (req, res) => {
    if (!req.query.id) return res.render('error.pug', { errorCode: '500' });

    client.database.deleteDocument('articles', req.query.id)
      .then(() => res.redirect('/admin/articles?success=deletedArticle'))
      .catch(() => res.render('error.pug', { errorCode: '500' }));
  });

module.exports = router;
