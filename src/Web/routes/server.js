const { Router } = require('express');
const client = require('../../index');

const router = Router()
  .get('/:id', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

    const guild = client.guilds.get(req.params.id);
    if (!guild) return res.render('error.pug', { errorCode: '500' });

    res.render('server.pug', {
      guild: {
        id: guild.id,
        name: guild.name,
        iconURL: guild.iconURL,
        creationDate: guild.createdAt.toUTCString(),
        ownerTag: guild.owner.user.tag,
        ownerID: guild.ownerID,
        members: guild.memberCount,
        bots: guild.members.filter(m => m.user.bot).size,
        online: guild.members.filter(m => m.user.presence.status === 'online').size,
        textChannels: guild.channels.filter(c => c.type === 'text').size,
        voiceChannels: guild.channels.filter(c => c.type === 'voice').size,
      },
    });
  });

module.exports = router;
