const { Router } = require('express');
const client = require('../../index');

const articles = require('./admin/articles');
const servers = require('./admin/servers');

const router = Router()
  .get('/guildChart', async (req, res) => {
    const guildChart = await client.database.getDocument('misc', 'guildChart');
    res
      .status(200)
      .json({
        list: guildChart.list,
      });
  });

module.exports = router;
