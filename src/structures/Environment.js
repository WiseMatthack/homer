class Environment {
  constructor(client, object, type, args) {
    this.client = client;
    this.vars = [];
    this.guild = null;
    this.member = null;
    this.user = null;
    this.channel = null;
    this.args = args || [];
    this.settings = object.settings;

    this._patch(object, type);
  }

  _patch(object, type) {
    if (type === 'tag') {
      this.guild = object.message.guild;
      this.member = object.message.member || null;
      this.user = object.message.author;
      this.channel = object.message.channel;
    } else if (type === 'memberlog') {
      this.guild = object.guild;
      this.member = object;
      this.user = object.user;
      this.channel = object.channel;
    }
  }
}

module.exports = Environment;
