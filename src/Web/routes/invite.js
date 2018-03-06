const { Router } = require('express');
const client = require('../../index');

const router = Router()
  .get('/', async (req, res) => {
    const link = await client.generateInvite();
    res.redirect(link);
  });

module.exports = router;
