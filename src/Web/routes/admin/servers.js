const { Router } = require('express');
const client = require('../../../index');

const router = Router()
  .use((req, res, next) => {
    if (req.isAuthenticated() && client.config.owners.includes(req.user.id)) return next();
    else return res.render('error.pug', { errorCode: '403' });
  })
  .get('/', (req, res) => {
    const guilds = client.guilds.map((guild) => {
      return ({
        name: guild.name,
        id: guild.id,
        owner: {
          id: guild.ownerID,
          tag: guild.owner.user.tag,
        },
        members: guild.memberCount,
        bots: Math.floor((guild.members.filter(m => m.user.bot).size / guild.memberCount) * 100),
        join: guild.joinedTimestamp,
      });
    });

    res.render('admin_guilds.pug', {
      guilds,
    });
  })
  .get('/leave', (req, res) => {
    if (!req.query.id) return res.render('error.pug', { errorCode: '500' });

    const guild = client.guilds.get(req.query.id);
    if (!guild) return res.render('error.pug', { errorCode: '500' });

    guild.leave()
      .then(() => res.redirect(`/admin/servers?success=guildLeft&guildName=${guild.name}`))
      .catch(() => res.render('error.pug', { errorCode: '500' }));
  });

module.exports = router;
