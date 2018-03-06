const { Router } = require('express');
const client = require('../../index');
const config = require('../../config.json');

const router = Router()
  .get('/', async (req, res) => {
    const invite = await client
      .guilds.get(config.support.guild)
      .channels.get(config.support.channel)
      .createInvite({
        temporary: true,
        maxAge: 60000,
        maxUses: 1,
        unique: true,
      });

    res.redirect(invite);
  });

module.exports = router;
