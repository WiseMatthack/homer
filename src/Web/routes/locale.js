const { Router } = require('express');
const i18n = require('i18n');

const router = Router()
  .get('/:locale', (req, res) => {
    if (!req.params.locale || !i18n.getLocales().includes(req.params.locale)) return res.redirect('/');

    res.cookie('locale', req.params.locale, {
      maxAge: 7257600000,
    });

    res.redirect('/');
  });

module.exports = router;
