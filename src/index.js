/**
 * Homer, a bot of the Simpson family.
 * Made by iDroid27210
 * Copyright (c) 2018 - AGPL 3.0 License
 * /!\ No self-host help /!\
 */

const Client = require('./Core/Client');
const i18n = require('i18n');

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
