const Event = require('../structures/Event');

class MessageUpdateEvent extends Event {
  constructor(client) {
    super(client, 'messageUpdate');
  }

  async handle(oldMessage, newMessage) {
    if (newMessage.author.id !== this.client.user.id) {
      this.client.database.getDocuments('calls')
        .then(async (calls) => {
          const callObject = calls.find(c => [c.sender.id, c.receiver.id].includes(newMessage.channel.id) && c.state === 1);
          if (!callObject) return;

          const target = (newMessage.channel.id === callObject.sender.id) ? callObject.receiver.id : callObject.sender.id;
          const targetMessage = await this.client.rest.methods.getChannelMessages(target, { limit: 100 })
            .then((data) => {
              const filter = m => !m.webhook_id
                && m.author.id == this.client.user.id
                && m.content.startsWith(`📞 **${newMessage.author.username}**#${newMessage.author.discriminator}: ${oldMessage.content}`);

              return data.find(filter);
            });
          if (!targetMessage) return;

          this.client.updateMessage(target, targetMessage.id, `📞 **${newMessage.author.username}**#${newMessage.author.discriminator}: ${newMessage.content}`);
        });
    }
  }
}

module.exports = MessageUpdateEvent;
