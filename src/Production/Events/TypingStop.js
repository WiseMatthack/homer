const Event = require('../../Core/Structures/Event');

class Resume extends Event {
  constructor(client) {
    super(client, 'typingStart');
  }

  async handle(channel) {
    if (channel.typing) return;

    const phoneCall = this.client.phone.calls.find(call => call.sender === channel.id || call.receiver === channel.id);
    if (phoneCall) {
      const type = phoneCall.sender === channel.id ? 'receiver' : 'sender';
      const targetChannel = this.client.channels.get(phoneCall[type]);
      if (!targetChannel) return;

      targetChannel.stopTyping();
    }
  }
}

module.exports = Resume;
