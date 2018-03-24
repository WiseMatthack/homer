const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

class Lookup extends Command {
  constructor(client) {
    super(client, {
      name: 'lookup',
      category: 2,
    });
  }

  async run(ctx) {
    const lookup = ctx.args.join(' ');
    if (!lookup) return ctx.channel.send(ctx.__('lookup.noLookup', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const embed = new RichEmbed()
      .setColor(ctx.guild.me.displayHexColor);

    if (this.client.guilds.has(lookup)) {
      const guild = this.client.guilds.get(lookup);

      embed
        .addField(ctx.__('lookup.guild.id'), guild.id, true)
        .addField(ctx.__('lookup.guild.owner.title'), ctx.__('lookup.guild.owner.value', { tag: guild.owner.user.tag }), true)
        .addField(ctx.__('lookup.guild.members.title'), ctx.__('lookup.guild.members.value', {
          total: guild.memberCount,
          bots: guild.members.filter(m => m.user.bot).size,
        }), true)
        .addField(ctx.__('lookup.guild.channels.title'), ctx.__('lookup.guild.channels.value', {
          text: guild.channels.filter(c => c.type === 'text').size,
          voice: guild.channels.filter(c => c.type === 'voice').size,
        }), true)
        .addField(ctx.__('lookup.guild.creation.title'), ctx.__('lookup.guild.creation.value', {
          creation: mtz(guild.createdTimestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`),
        }))
        .setThumbnail(guild.iconURL);

      ctx.channel.send(ctx.__('lookup.guild.title', {
        name: guild.name,
      }), { embed });
    } else {
      let user = null;
      await this.client.fetchUser(lookup, false)
        .then((fetched) => {
          user = fetched;
        })
        .catch(() => {});

      if (user) {
        const premium = (user.avatar && user.avatar.startsWith('a_')) ? ctx.__('global.yes') : ctx.__('global.no');
        const emote = user.bot ? '<:bot:420699407344730122>' : '👤';

        embed
          .addField(ctx.__('lookup.user.id'), user.id, true)
          .addField(ctx.__('lookup.user.premium', {
            nitroIcon: this.client.emojis.get(this.client.constants.nitroIcon).toString(),
          }), premium, true)
          .addField(ctx.__('lookup.user.creation.title'), ctx.__('lookup.user.creation.value', {
            creation: mtz(user.createdTimestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`),
          }))
          .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`);

        ctx.channel.send(ctx.__('lookup.user.title', {
          emote,
          name: user.tag,
        }), { embed });
      } else {
        let invite = null;
        await this.client.fetchInvite(lookup)
          .then((fetched) => {
            invite = fetched;
          })
          .catch(() => {});

        if (invite) {
          embed
            .addField(ctx.__('lookup.invite.inviter.title'), ctx.__('lookup.invite.inviter.value', {
              tag: invite.inviter.tag,
            }))
            .addField(ctx.__('lookup.invite.channel.title'), ctx.__('lookup.invite.channel.value', {
              name: invite.channel.name,
            }))
            .setFooter(ctx.__('lookup.invite.footer', { code: invite.code }))
            .setThumbnail(invite.guild.iconURL);

          ctx.channel.send(ctx.__('lookup.invite.title', {
            name: invite.guild.name,
          }), { embed });
        } else {
          ctx.channel.send(ctx.__('lookup.nothingFound', {
            errorIcon: this.client.constants.statusEmotes.error,
            lookup,
          }));
        }
      }
    }
  }
}

module.exports = Lookup;
