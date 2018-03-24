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
  updateFiles: false,
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
  console.error(error);

  for (const ownerID of client.config.owners) {
    const user = client.users.get(ownerID);
    user.send(`If it hadn't been for cotton-eye Joe\nI'd been married long time ago\nWhere did you come from. Where did you go ?\nWhere did you come from cotton-eye Joe ?\n\n\`\`\`js\n${error.message}\`\`\``, {
      video: {
        url: 'https://www.youtube.com/watch?v=mOYZaiDZ7BM',
        height: 100,
        width: 100,
      },
    })
      .catch(() => {}); // No but shit I won't handle the error of an error
  }
});

process.on('uncaughtException', async (err) => {
  console.error(err);

  // For security reasons we shutdown everything related to the bot here
  await client.dashboard.shutdown();
  await client.database.provider.getPoolMaster().drain();
  await client.destroy();

  process.exit(0);
});

process.on('SIGINT', async () => {
  await client.dashboard.shutdown();
  await client.database.provider.getPoolMaster().drain();
  await client.destroy();

  process.exit(0);
});
