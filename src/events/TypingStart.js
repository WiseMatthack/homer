const Event = require('../structures/Event');

class TypingStartEvent extends Event {
  constructor(client) {
    super(client, 'typingStart');
  }

  async handle(channel, user) {
    if (user.id !== this.client.user.id) {
      this.client.database.getDocuments('calls').then((calls) => {
        const callObject = calls.find(c => [c.sender.id, c.receiver.id].includes(channel.id) && c.state === 1);
        if (!callObject) return;

        const state = (channel.id === callObject.sender.id) ? 'receiver' : 'sender';
        this.client.rest.methods.sendTyping(callObject[state].id);
      });
    }
  }
}

module.exports = TypingStartEvent;
