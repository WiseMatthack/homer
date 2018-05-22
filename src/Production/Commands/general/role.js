const Command = require('../../../Core/Structures/Command');
const mtz = require('moment-timezone');
const { RichEmbed, Permissions } = require('discord.js');

class Role extends Command {
  constructor(client) {
    super(client, {
      name: 'role',
      aliases: ['roleinfo'],
      category: 'general',
    });
  }

  async run(ctx) {
    const search = ctx.args.join(' ');
    if (!search) return ctx.channel.send(ctx.__('role.error.noSearch', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    let role = this.client.finder.findRoles(search, ctx.guild.id).first();
    if (!role) return ctx.channel.send(ctx.__('role.error.notFound', {
      errorIcon: this.client.constants.statusEmotes.error,
      search,
    }));

    const permissions = new Permissions(role.permissions).serialize();
    const permissionString = Object.keys(permissions)
      .filter(perm => permissions[perm])
      .map(perm => `\`${perm}\``)
      .join(', ');

    const embed = new RichEmbed()
      .addField(ctx.__('role.embed.id'), role.id, true)
      .addField(ctx.__('role.embed.color'), role.hexColor ? role.hexColor.toUpperCase() : ctx.__('global.none'), true)
      .addField(ctx.__('role.embed.position'), `#${role.position}`, true)
      .addField(ctx.__('role.embed.managed'), role.managed ? ctx.__('global.yes') : ctx.__('global.no'), true)
      .addField(ctx.__('role.embed.hoisted'), role.hoist ? ctx.__('global.yes') : ctx.__('global.no'), true)
      .addField(ctx.__('role.embed.mentionable'), role.mentionable ? ctx.__('global.yes') : ctx.__('global.no'), true)
      .addField(ctx.__('role.embed.permissions'), permissionString, false)
      .addField(ctx.__('role.embed.creation'), mtz(role.createdTimestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`), false)
      .setColor(role.hexColor === '#000000' ? undefined : role.hexColor);

    ctx.channel.send(ctx.__('role.title', {
      name: role.name,
    }), { embed });
  }
}

module.exports = Role;
