const Event = require('../structures/Event');

class MessageDeleteEvent extends Event {
  constructor(client) {
    super(client, 'messageDelete');
  }

  async handle(message) {
    if (message.author.id !== this.client.user.id) {
      this.client.database.getDocuments('calls')
        .then(async (calls) => {
          const callObject = calls.find(c => [c.sender.id, c.receiver.id].includes(message.channel.id) && c.state === 1);
          if (!callObject) return;

          const target = (message.channel.id === callObject.sender.id) ? callObject.receiver.id : callObject.sender.id;
          const targetMessage = await this.client.rest.methods.getChannelMessages(target, { limit: 100 })
            .then((data) => {
              const filter = (m) => 
                !m.webhook_id &&
                m.author.id == this.client.user.id &&
                m.content.startsWith(`📞 **${message.author.username}**#${message.author.discriminator}: ${message.content}`);

              return data.find(filter);
            });
          if (!targetMessage) return;

          this.client.deleteMessage(target, targetMessage.id);
        });
    }
  }
}

module.exports = MessageDeleteEvent;
