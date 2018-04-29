const Manager = require('./Manager');
const DataGuild = require('../Structures/Data/DataGuild');
const i18n = require('i18n');

/**
 * Represents a telephone manager.
 * @extends {Manager}
 */
class PhoneManager extends Manager {
  /**
   * @param {Client} client Client that initiated the database manager
   */
  constructor(client) {
    super(client);

    /**
     * Active telephone calls.
     * @type {PhoneCall[]}
     */
    this.calls = [];
  }

  /**
   * Is a call active.
   * @param {String} id Guild ID
   * @returns {Boolean}
   */
  isCallActive(id) {
    if (this.calls.find(c => (c.sender === id || c.receiver === id) && c.state === 1)) return 'active';
    else if (this.calls.find(c => (c.sender === id || c.receiver === id) && c.state === 0)) return 'pending';
    return 'none';
  }

  /**
   * Initiate call.
   * @param {String} sender Sender ID
   * @param {String} receiver Receiver ID
   */
  async initiateCall(sender, receiver) {
    const senderSettings = new DataGuild(this.client, sender);
    await senderSettings.getData();

    const receiverSettings = new DataGuild(this.client, receiver);
    await receiverSettings.getData();

    i18n.setLocale(senderSettings.data.misc.locale);
    const callingMsg = await this.client.channels
      .get(senderSettings.data.phone.channel)
      .send(i18n.__('phone.calling', { number: receiverSettings.data.phone.number }));

    i18n.setLocale(receiverSettings.data.misc.locale);
    const incomingCallMsg = await this.client.channels
      .get(receiverSettings.data.phone.channel)
      .send(i18n.__('phone.incomingCall', {
        number: senderSettings.data.phone.number,
        prefix: this.client.config.discord.defaultPrefixes[0],
        callMessage: receiverSettings.data.phone.callMessage ? `\n${receiverSettings.data.phone.callMessage}` : '',
      }));

   const call = {
      sender,
      receiver,
      state: 0,
      senderMessage: callingMsg.id,
      receiverMessage: incomingCallMsg.id,
    };
    this.calls.push(call);

    setTimeout(async () => {
      const callObject = this.calls.find(c => c.sender === sender && c.receiver === receiver);
      if (!callObject || callObject.state !== 0) return;
      this.calls.splice(this.calls.indexOf(callObject), 1);

      i18n.setLocale(senderSettings.data.misc.locale);
      await callingMsg.edit(i18n.__('phone.noAnswer', { number: receiverSettings.data.phone.number }));

      i18n.setLocale(receiverSettings.data.misc.locale);
      await incomingCallMsg.edit(i18n.__('phone.missedCall', { number: senderSettings.data.phone.number }));
    }, 30000);
  }

  /**
   * Pickup a call.
   * @param {String} id Receiver ID
   */
  async pickupCall(id) {
    const call = this.calls.find(c => c.receiver === id);
    if (!call) return;

    call.state = 1;
    this.calls.splice(this.calls.indexOf(call), 1);
    this.calls.push(call);

    const senderSettings = await this.client.database.getDocument('guild', call.sender);
    const receiverSettings = await this.client.database.getDocument('guild', call.receiver);

    i18n.setLocale(senderSettings.misc.locale);
    this.client.channels
      .get(senderSettings.phone.channel)
      .send(i18n.__('phone.pickup.sender'));

    i18n.setLocale(receiverSettings.misc.locale);
    this.client.channels
      .get(receiverSettings.phone.channel)
      .send(i18n.__('phone.pickup.receiver'));
  }

  /**
   * Interrupt a call.
   * @param {String} id Sender or receiver ID
   */
  async interruptCall(id) {
    const call = this.calls.find(c => c.sender === id || c.receiver === id);
    if (!call) return;
    this.calls.splice(this.calls.indexOf(call), 1);

    const senderSettings = await this.client.database.getDocument('guild', call.sender);
    const receiverSettings = await this.client.database.getDocument('guild', call.receiver);

    i18n.setLocale(senderSettings.misc.locale);
    this.client.channels
      .get(senderSettings.phone.channel)
      .send(i18n.__('phone.hangup'));

    i18n.setLocale(receiverSettings.misc.locale);
    this.client.channels
      .get(receiverSettings.phone.channel)
      .send(i18n.__('phone.hangup'));
  }
}

module.exports = PhoneManager;

/**
 * @typedef PhoneCall
 * @property {String} sender Sender guild ID
 * @property {String} receiver Receiver guild ID
 * @property {Number} state Call state (0: Awaiting for receiver pickup - 1: Incall)
 */
