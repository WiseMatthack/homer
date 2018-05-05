const Event = require('../../Core/Structures/Event');

class UserUpdate extends Event {
  constructor(client) {
    super(client, 'userUpdate');
  }

  async handle(oldUser, newUser) {
    if (oldUser.username !== newUser.username) {
      const nameObject = (await this.client.database.getDocument('names', oldUser.id)) || ({
        id: oldUser.id,
        names: [],
      });

      nameObject.names.push(oldUser.username);
      this.client.database.insertDocument('names', nameObject, { conflict: 'update' });
    }

    if (oldUser.presence.status !== newUser.presence.status) {
      const lastactiveObject = (await this.client.database.getDocument('lastactive', oldUser.id)) || ({
        id: oldUser.id,
      });

      lastactiveObject.presenceUpdate = Date.now();
      this.client.database.insertDocument('lastactive', lastactiveObject, { conflict: 'update' });
    }
  }
}

module.exports = UserUpdate;
