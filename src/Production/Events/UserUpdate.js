const Event = require('../../Core/Structures/Event');

class UserUpdate extends Event {
  constructor(client) {
    super(client, 'userUpdate');
  }

  async handle(oldUser, newUser) {
    const nameObject = (await this.client.database.getDocument('names', oldUser.id)) || ({
      id: oldUser.id,
      names: [],
    });

    nameObject.names.push(oldUser.username);
    this.client.database.insertDocument('names', nameObject, { conflict: 'update' });
  }
}

module.exports = UserUpdate;
