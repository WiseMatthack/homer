/**
 * Homer, a bot of the Simpson family.
 * Made by iDroid27210
 * Copyright (c) 2018 - AGPL 3.0 License
 * /!\ No self-host help /!\
 */

const Client = require('./Core/Client');
const i18n = require('i18n');
const { DiscordAPIError } = require('discord.js');

/* Client */
const client = new Client();

/* i18n configuration */
i18n.configure({
  autoReload: true,
  cookie: 'locale',
  defaultLocale: 'en-gb',
  directory: `${__dirname}/Production/Locales`,
  syncFiles: process.platform === 'linux' ? false : true,
});

/* Loading events */
client.loadEvents();

/* Client login */
client.login(client.config.discord.token)
  .catch(console.error);

/* Module exporting */
module.exports = client;

/* Process stuff */
process.on('unhandledRejection', (error) => {
  if (error instanceof DiscordAPIError) return;
  console.error(error instanceof Error ? error : `[Error] Unhandled rejection:\n${error}`);
});

process.on('uncaughtException', async (err) => {
  console.error(err);

  // For security reasons we shutdown everything related to the bot here
  await client.dashboard.shutdown();
  await client.database.provider.getPoolMaster().drain();
  await client.destroy();

  process.exit(0);
});

process.on('SIGINT', () => {
  await client.dashboard.shutdown();
  await client.database.provider.getPoolMaster().drain();
  await client.destroy();

  process.exit(0);
});
