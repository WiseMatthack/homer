const Event = require('../../Core/Structures/Event');

class TypingStart extends Event {
  constructor(client) {
    super(client, 'typingStart');
  }

  async handle(channel) {
    const phoneCall = this.client.phone.calls.find(call => call.sender === channel.id || call.receiver === channel.id);
    if (phoneCall) {
      const type = phoneCall.sender === channel.id ? 'receiver' : 'sender';
      const targetChannel = this.client.channels.get(phoneCall[type]);
      if (!targetChannel) return;

      targetChannel.startTyping();
    }
  }
}

module.exports = TypingStart;
