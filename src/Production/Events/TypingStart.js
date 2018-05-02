const Event = require('../../Core/Structures/Event');

class TypingStart extends Event {
  constructor(client) {
    super(client, 'typingStart');
  }

  async handle(channel) {
    const phoneCall = this.client.phone.calls.find(call =>
      call.state === 1 &&
      (call.sender === channel.id || call.receiver === channel.id));
    if (phoneCall) {
      const type = phoneCall.sender === channel.id ? 'receiver' : 'sender';
      const targetGuild = this.client.guilds.get(phoneCall[type]);
      if (!targetGuild) return;

      const targetChannel = targetGuild.channels.get(
        await this.client.database.getDocument('guild', targetGuild.id).then(s => s.phone.channel),
      );

      targetChannel.startTyping();
    }
  }
}

module.exports = TypingStart;
