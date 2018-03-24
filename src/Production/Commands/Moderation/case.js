const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

class Case extends Command {
  constructor(client) {
    super(client, {
      name: 'case',
      userPermissions: ['KICK_MEMBERS'],
      category: 5,
    });
  }

  async run(ctx) {
    const caseID = ctx.args[0];
    if (!caseID || Number.isNaN(parseInt(caseID, 10))) return ctx.channel.send(ctx.__('case.error.invalidCase', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const caseIndex = (ctx.args[0] - 1);
    const foundCase = ctx.settings.data.moderation.cases[caseIndex];
    if (!foundCase) return ctx.channel.send(ctx.__('case.error.notFound', {
      errorIcon: this.client.constants.statusEmotes.error,
      caseID,
    }));

    const embed = new RichEmbed()
      .addField(ctx.__('case.embed.action'), ctx.__(`moderation.action.${foundCase.action}`), false)
      .addField(ctx.__('case.embed.author'), `<@${foundCase.author}>`, true)
      .addField(ctx.__('case.embed.target'), `<${foundCase.action === 5 ? '#' : '@'}${foundCase.target}>`, true)
      .addField(ctx.__('case.embed.reason'), foundCase.reason, true)
      .addField(ctx.__('case.embed.time'), mtz(foundCase.time).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`), true)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('case.title', {
      caseID,
    }), { embed });
  }
}

module.exports = Case;
