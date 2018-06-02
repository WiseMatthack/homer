const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');
const snekfetch = require('snekfetch');
const { deconstruct } = require('../../../../node_modules/discord.js/src/util/Snowflake');

class Lookup extends Command {
  constructor(client) {
    super(client, {
      name: 'lookup',
      category: 'general',
    });
  }

  async run(ctx) {
    const lookup = ctx.args.join(' ');
    if (!lookup) return ctx.channel.send(ctx.__('lookup.error.noLookup', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const embed = new RichEmbed()
      .setColor(ctx.guild.me.displayHexColor);

    if (isNaN(lookup)) {
      this.client.fetchInvite(lookup)
        .then((invite) => {
          embed
            .addField(ctx.__('lookup.invite.id'), invite.guild.id)
            .addField(
              ctx.__('lookup.invite.inviter.title'),
              invite.inviter ? ctx.__('lookup.invite.inviter.value', {
                tag: invite.inviter.tag,
                id: invite.inviter.id,
              }) : ctx.__('global.unknown'),
            )
            .addField(ctx.__('lookup.invite.channel.title'), ctx.__('lookup.invite.channel.value', {
              name: invite.channel.name,
              id: invite.channel.id,
            }))
            .setFooter(ctx.__('lookup.invite.footer', { code: invite.code }))
            .setThumbnail(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png`);

          ctx.channel.send(ctx.__('lookup.invite.title', {
            name: invite.guild.name,
          }), { embed });
        })
        .catch(() => ctx.channel.send(ctx.__('lookup.error.noInviteFound', { errorIcon: this.client.constants.statusEmotes.error, lookup })));
    } else {
      const guildReq = await snekfetch
        .get(`https://discordapp.com/api/guilds/${lookup}/widget.json`)
        .set({
          'User-Agent': `DiscordBot (https://github.com/iDroid27210/homer) Node.js/${process.version}`,
          'Accept-Encoding': 'gzip',
        })
        .then(res => res.body)
        .catch(res => res.body);

      if (guildReq.code !== 10004) {
        if (guildReq.code === 50004) return ctx.channel.send(ctx.__('lookup.error.noMoreGuildInfo', {
          warningIcon: this.client.constants.statusEmotes.warning,
          lookup,
        }));

        const inviteCode = guildReq.instant_invite ?
          guildReq.instant_invite.replace('https://discordapp.com/invite/', '') : null;

        const { timestamp } = deconstruct(guildReq.id);
        const meta = await this.client.fetchInvite(guildReq.instant_invite)
          .then(i => ({ icon: `https://cdn.discordapp.com/icons/${i.guild.id}/${i.guild.icon}.png` }))
          .catch(() => ({ icon: `https://${this.client.config.dashboard.baseDomain}/images/icons/no-image.png` }));

        embed
          .addField(ctx.__('lookup.guild.id'), guildReq.id, true)
          .addField(ctx.__('lookup.guild.members.title'), ctx.__('lookup.guild.members.value', {
            online: `${this.client.emojis.get(this.client.constants.presenceIcons.online).toString()} ${guildReq.members.filter(m => m.status === 'online').length}`,
            idle: `${this.client.emojis.get(this.client.constants.presenceIcons.idle).toString()} ${guildReq.members.filter(m => m.status === 'idle').length}`,
            dnd: `${this.client.emojis.get(this.client.constants.presenceIcons.dnd).toString()} ${guildReq.members.filter(m => m.status === 'dnd').length}`,
          }), true)
          .addField(ctx.__('lookup.guild.invite.title'), ctx.__('lookup.guild.invite.value', {
            invite: guildReq.instant_invite ?
              `[${inviteCode}](https://discord.gg/${inviteCode})` :
              ctx.__('global.none'),
          }), true)
          .addField(ctx.__('lookup.guild.creation.title'), ctx.__('lookup.guild.creation.value', {
            creation: mtz(timestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`),
          }), true)
          .setThumbnail(meta.icon);

        ctx.channel.send(ctx.__('lookup.guild.title', {
          name: guildReq.name,
        }), { embed });
      } else {
        this.client.fetchUser(lookup, false)
          .then((user) => {
            const badges = [];
            if (member.user.avatar && member.user.avatar.startsWith('a_')) badges.push(this.client.emojis.get(this.client.constants.nitroIcon).toString());
            if (this.client.constants.discordStaff.includes(member.id)) badges.push(this.client.emojis.get(this.client.constants.staffIcon).toString());

            const emote = user.bot ? '<:bot:420699407344730122>' : '👤';
            const extension = (user.avatar && user.avatar.startsWith('a_')) ? 'gif' : 'png';

            embed
              .addField(ctx.__('lookup.user.id'), user.id)
              .addField(ctx.__('lookup.user.creation.title'), ctx.__('lookup.user.creation.value', {
                creation: mtz(user.createdTimestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`),
              }))
              .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}`);

            ctx.channel.send(ctx.__('lookup.user.title', {
              emote,
              name: user.tag,
              badges: (badges.length > 0) ? ` ${badges.join(' ')}` : '',
            }), { embed });
          })
          .catch(() => ctx.channel.send(ctx.__('lookup.error.noUserOrGuild', { errorIcon: this.client.constants.statusEmotes.error, lookup })));
      }
    }
  }
}

module.exports = Lookup;
