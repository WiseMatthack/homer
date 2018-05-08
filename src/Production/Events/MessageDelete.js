const Event = require('../../Core/Structures/Event');

class MessageDelete extends Event {
  constructor(client) {
    super(client, 'messageDelete');
  }

  async handle(message) {
    const phone = this.client.phone.calls
      .filter(c => c.state === 1)
      .find(c => c.sender === message.guild.id || c.receiver === message.guild.id);
    if (!phone) return;

    const distantType = phone.sender === message.guild.id ? 'receiver' : 'sender';
    const distantGuild = this.client.guilds.get(phone[distantType]);
    const distantSettings = await this.client.database.getDocument('guild', distantGuild.id);
    const distantChannel = distantGuild.channels.get(distantSettings.phone.channel);

    const fetchedMessage = await distantChannel.fetchMessages({ limit: 50 })
      .then(messages => messages.find(m => m.content === `☎ **${message.author.tag}**: ${message.cleanContent}`));
    if (!fetchedMessage) return;

    fetchedMessage.delete();
  }
}

module.exports = MessageDelete;
