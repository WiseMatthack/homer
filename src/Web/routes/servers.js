const { Router } = require('express');
const client = require('../../index');

const router = Router()
  .get('/', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

    const mutualGuilds = client.guilds.filter(g => g.members.has(req.user.id));
    res.render('servers.pug', {
      mutualGuilds: mutualGuilds.map(g => ({
        name: g.name,
        id: g.id,
        iconURL: g.iconURL,
      })),
    });
  });

module.exports = router;
