const { Router } = require('express');
const client = require('../../index');
const i18n = require('i18n');

const router = Router()
  .get('/:locale', async (req, res) => {
    if (!req.params.locale) return res.render('error.pug', { errorCode: '404' });
    if (!i18n.getLocales().includes(req.params.locale)) return res.render('error.pug', { errorCode: '500' });

    res.cookie('locale', req.params.locale, {
      maxAge: 7257600000, // I think 3 months is enough
    });

    res.redirect('/');
  });

module.exports = router;
