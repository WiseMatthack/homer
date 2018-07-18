const BigInt = require('big-integer');
const snekfetch = require('snekfetch');

class OtherUtil {
  constructor(client) {
    this.client = client;
  }

  getShardID(id) {
    // (guild_id >> 22) % shard_count === shard_id (source: Discord Developers documentation)
    // We use big-integer because JS doesn't support natively 64-bit integers
    // Thanks to Danny from DAPI for the tip
    return new BigInt(id).shiftRight('22').mod(this.client.config.sharder.totalShards);
  }

  generateNumber(id) {
    return `${id.substring(id.length - 3)}-${(Math.random().toFixed(3).toString().substring(2))}`;
  }

  async getRadio(id, url) {
    const b1 = this.client.voiceBroadcasts[id];
    if (b1) return b1;

    const b2 = this.client.createVoiceBroadcast();
    await b2.playStream(url, { bitrate: 64 });
    this.client.voiceBroadcasts[id] = b2;
    return b2;
  }

  async handleCleverbot(context) {
    const cleverbotState = await this.client.database.getDocument('bot', 'settings').then(s => s.cleverbot);
    const text = context.args.join(' ');
    if (!text || !cleverbotState) return;
    context.message.channel.startTyping(1);
    snekfetch
      .post('https://cleverbot.io/1.0/ask')
      .set({ 'Content-Type': 'application/json' })
      .send({
        user: this.client.config.api.cleverbotUser,
        key: this.client.config.api.cleverbotKey,
        text,
        nick: this.client.user.id,
      })
      .then((res) => {
        context.reply(res.body.response);
        context.message.channel.stopTyping();

        this.client.database.insertDocument('commandStats', {
          author: context.message.author.id,
          guild: context.message.guild ? context.message.guild.id : 'dm',
          command: 'cleverbot',
          question: text,
          answer: res.body.response,
          time: Date.now(),
        });
      })
      .catch((res) => { context.replyError(`ERROR: \`${res.body ? res.body.status : 'UNKNOWN'}\``); context.message.channel.stopTyping(true); });
  }
}

module.exports = OtherUtil;
