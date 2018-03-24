const Command = require('../../../Core/Structures/Command');
const snekfetch = require('snekfetch');
const tpm = require('to-pure-markdown');
const { RichEmbed } = require('discord.js');

class Checkdbans extends Command {
  constructor(client) {
    super(client, {
      name: 'checkdbans',
      aliases: ['dbans', 'checkbans'],
      category: 2,
    });
  }

  async run(ctx) {
    let user = ctx.author;
    const search = ctx.args.join(' ');

    if (ctx.mentions.users.size > 0) user = ctx.mentions.users.first();
    else if (search.length === 18 && !Number.isNaN(parseInt(search, 10))) {
      await this.client.fetchUser(search)
        .then((fetchedUser) => {
          user = fetchedUser;
        })
        .catch(() => {});
    } else if (search) {
      const users = this.client.finder.findUsers(search);
      if (users.size === 0) return ctx.channel.send(ctx.__('finder.users.noResult', { errorIcon: this.client.constants.statusEmotes.error, search }));
      else if (users.size > 1) return ctx.channel.send(this.client.finder.formatUsers(
        users,
        ctx.settings.data.misc.locale,
      ));
      user = users.first();
    }

    snekfetch
      .post('https://bans.discordlist.net/api')
      .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
      .send({
        version: 3,
        userid: user.id,
        token: this.client.config.api.discordBans,
      })
      .then((response) => {
        const resp = response.body.toString();

        const status = resp === 'False' ? ctx.__('checkdbans.embed.status.isNot') : ctx.__('checkdbans.embed.status.is');
        const color = resp === 'False' ? 'GREEN' : 'RED';
        const reason = resp === 'False' ? null : JSON.parse(resp)[3];
        const proof = resp === 'False' ? null : JSON.parse(resp)[4];

        const embed = new RichEmbed()
          .addField(ctx.__('checkdbans.embed.status.title'), status)
          .setColor(color)
          .setThumbnail(user.displayAvatarURL);

        if (reason) {
          embed
            .addField(ctx.__('checkdbans.embed.reason'), reason)
            .addField(ctx.__('checkdbans.embed.reason'), tpm(proof));
        }

        ctx.channel.send(ctx.__('checkdbans.title', { dbansIcon: this.client.constants.serviceIcons.discordBans, name: user.tag }), { embed });
      })
      .catch(() => ctx.channel.send(ctx.__('checkdbans.error', { errorIcon: this.client.constants.statusEmotes.error })));
  }
}

module.exports = Checkdbans;
