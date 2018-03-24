const { Router } = require('express');
const client = require('../../index');

const pug = require('pug');

const router = Router()
  .get('/:uuid', async (req, res) => {
    const article = await client.database.getDocument('articles', req.params.uuid);
    if (!article) return res.render('error.pug', { errorCode: '404' });

    article.content = pug.render(article.content);

    const articleAuthor = await client.fetchUser(article.author);

    res.render('article.pug', {
      article,
      articleAuthor,
    });
  });

module.exports = router;
