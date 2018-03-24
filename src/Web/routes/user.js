const { Router } = require('express');
const client = require('../../index');

const router = Router()
  .get('/:id', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

    const user = client.users.get(req.params.id);
    if (!user) return res.render('error.pug', { errorCode: '500' });

    res.render('user.pug', {
      user: {
        id: user.id,
        tag: user.tag,
        avatarURL: user.displayAvatarURL,
        creationDate: user.createdAt.toUTCString(),
        presenceStatus: req.__(`presence.${user.presence.status}`),
        presenceIcon: client.emojis.get(client.constants.presenceIcons[user.presence.status]).url,
        presenceGame: user.presence.game ? user.presence.game.name : null,
        premium: user.avatar.startsWith('a_') ? `${client.emojis.get(client.constants.nitroIcon).url} Discord Nitro` : req.__('global.none'),
      },
    });
  });

module.exports = router;
