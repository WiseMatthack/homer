const { Router } = require('express');
const auth = require('../modules/auth');

const router = Router()
  .get('/login', auth.authenticate('discord'))
  .get('/callback', auth.authenticate('discord'), (req, res) => {
    res.redirect('/');
  })
  .get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

module.exports = router;
