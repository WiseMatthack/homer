const Event = require('../../Core/Structures/Event');

class MessageEdit extends Event {
  constructor(client) {
    super(client, 'messageEdit');
  }

  async handle(oldMessage, newMessage) {
    const phone = this.client.phone.calls
      .filter(c => c.state === 1)
      .find(c => c.sender === newMessage.guild.id || c.receiver === newMessage.guild.id);
    if (!phone) return;

    const distantType = phone.sender === newMessage.guild.id ? 'receiver' : 'sender';
    const distantGuild = this.client.guilds.get(phone[distantType]);
    const distantSettings = await this.client.database.getDocument('guild', distantGuild.id);
    const distantChannel = distantGuild.channels.get(distantSettings.phone.channel);

    const fetchedMessage = await distantChannel.fetchMessages({ limit: 50 })
      .then(messages => messages.find(m => m.content.startsWith(`☎ **${newMessage.author.tag}**: ${oldMessage.cleanContent}`)));
    if (!fetchedMessage) return;

    fetchedMessage.edit(fetchedMessage.content
      .replace(oldMessage.cleanContent, newMessage.cleanContent));
  }
}

module.exports = MessageEdit;
