/**
 * Homer, an all-in-one bot for Discord
 * Spawns all required shards to make bot work
 * Copyright (c) 2018 - iDroid27210
 */

// Modules
const Sharder = require('./structures/Sharder');
const config = require('../config.json');

// Initializing sharder
const sharder = new Sharder(`${__dirname}/bot.js`, config);

sharder.on('message', (shard, mail) => {
  if (typeof mail !== 'object') return;

  // Log
  if (mail.type === 'log') {
    console.log(`[Shard ${shard.id}] ${mail.message}`);
  } else if (mail.type === 'error') {
    console.error(`[Shard ${shard.id}] ${mail.message}`);
  }
});

// Spawn shards
sharder.spawn(sharder.config.sharder.totalShards, sharder.config.sharder.delay)
  .then(shards => console.log(`[Sharder] Spawning ${shards.size} shards...`))
  .catch(console.error);
