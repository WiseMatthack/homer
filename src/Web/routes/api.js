const { Router } = require('express');
const client = require('../../index');
const i18n = require('i18n');
const mtz = require('moment-timezone');

const router = Router()
  .post('/vote', async (req, res) => {
    if (req.header('Authorization') !== client.config.api.discordBotsWebhook) return res
      .status(403)
      .json({
        message: 'INVALID_TOKEN',
      });

    const channel = client.channels.get(client.config.logChannels.votes);
    const voteMessage = await channel.send(`\`[${mtz().format('HH:mm:ss')}]\` 🗳 **PROCESSING**`);
    let editedMessage = null;

    if (req.body.type === 'test') {
      editedMessage = 'Test vote received from **Discord Bot List**, works fine.';
    } else {
      const user = client.users.get(req.body.user) || (await client.fetchUser(req.body.user));
      if (!user) return;

      const voteObject = (await client.database.getDocument('votes', user.id) || {
        id: user.id,
        count: 0,
      });

      voteObject.count += 1;
      await client.database.insertDocument('votes', voteObject, { conflict: 'update' });

      const userLocale = (await client.database.getDocument('profile', user.id).then(p => (p ? (p.locale || 'en-gb') : 'en-gb')));
      i18n.setLocale(userLocale);

      user.send(i18n.__('vote.webhookDM'))
        .catch(() => {});

      editedMessage = `**${user.tag}** voted on Discord Bot List - Vote count: ${voteObject.count}`;
    }

    voteMessage.edit(voteMessage.content.replace('**PROCESSING**', editedMessage));
  });

module.exports = router;
