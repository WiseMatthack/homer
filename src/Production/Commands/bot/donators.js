const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');

class Donators extends Command {
  constructor(client) {
    super(client, {
      name: 'donators',
      aliases: ['donation', 'donate'],
      category: 'bot',
    });
  }

  async run(ctx) {
    const donators = [];

    for (const donation of this.client.config.donators) {
      donators.push(ctx.__('donators.hasDonated', {
        user: await this.client.fetchUser(donation.user).then(user => user.tag),
        amount: donation.amount,
      }));
    }

    const embed = new RichEmbed()
      .setDescription(ctx.__('donators.text'))
      .addField('‎', donators.join('\n'))
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('donators.donationTitle'), { embed });
  }
}

module.exports = Donators;
