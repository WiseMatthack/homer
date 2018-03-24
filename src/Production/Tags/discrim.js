const TagFunction = require('../../Core/Structures/TagFunction');

class DiscrimFunction extends TagFunction {
  run(args) {
    const search = args[0];
    if (!search) throw new Error('You must provide the (part of) a username or tag to search for.');

    const foundUser = this.context.guild.members
      .filter(m => m.user.tag.toLowerCase().includes(search.toLowerCase())
                || m.displayName.toLowerCase().includes(search.toLowerCase())
                || m.id === search);

    if (!foundUser) throw new Error('No member found matching the given search.');
    return foundUser.user.discriminator;
  }
}

module.exports = DiscrimFunction;
