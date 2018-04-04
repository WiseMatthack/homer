const { Router } = require('express');
const client = require('../../index');
const i18n = require('i18n');

const router = Router()
  .post('/vote', async (req, res) => {
    if (req.header('Authorization') !== client.config.api.discordBotsWebhook) return;

    const user = client.users.get(req.body.user) || (await client.fetchUser(req.body.user));
    if (!user) return;

    const voteObject = (await client.database.getDocument('votes', user.id) || {
      id: user.id,
      count: 0,
    });

    voteObject.count += 1;
    await client.database.insertDocument('votes', voteObject, { conflict: 'update' });

    const userLocale = (await client.database.getDocument('profile', user.id).then(p => p.locale) || 'en-gb');
    i18n.setLocale(userLocale);

    user.send(i18n.__('vote.webhookDM'))
      .catch(() => {});
  });

module.exports = router;
