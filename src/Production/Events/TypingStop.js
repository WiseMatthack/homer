const Event = require('../../Core/Structures/Event');

class TypingStop extends Event {
  constructor(client) {
    super(client, 'typingStop');
  }

  async handle(channel, user) {
    if (user.id === this.client.user.id || channel.typing) return;

    const phoneCall = this.client.phone.calls.find(call =>
      call.state === 1 &&
      (call.sender === channel.guild.id || call.receiver === channel.guild.id));
    console.log(phoneCall);
    if (phoneCall) {
      const type = phoneCall.sender === channel.guild.id ? 'receiver' : 'sender';
      const targetGuild = this.client.guilds.get(phoneCall[type]);
      console.log(`Type: ${type} - ID: ${targetGuild.id}`);
      const targetChannel = targetGuild.channels.get(
        await this.client.database.getDocument('guild', targetGuild.id).then(s => s.phone.channel),
      );
      console.log(`ID: ${targetChannel.id}`)

      targetChannel.send('DEBUG TYPINGSTOP EVENT WORKING')
      targetChannel.stopTyping(true);
    }
  }
}

module.exports = TypingStop;
