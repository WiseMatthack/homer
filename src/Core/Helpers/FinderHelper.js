const Helper = require('./Helper');
const i18n = require('i18n');

/**
 * Represents a finder helper.
 * @extends {Helper}
 */
class FinderHelper extends Helper {
  /**
   * Finds members.
   * @param {String} search Search terms
   * @param {String} id Guild ID
   * @returns {GuildMember[]}
   */
  findMembers(search, id) {
    const search2 = search.toLowerCase();
    return this.client.guilds.get(id).members.filter(m =>
      m.user.tag.toLowerCase().includes(search2) ||
      m.displayName.toLowerCase().includes(search2) ||
      m.id === search2);
  }

  /**
   * Finds users.
   * @param {String} search Search terms
   * @returns {User[]}
   */
  findUsers(search) {
    const search2 = search.toLowerCase();
    return this.client.users.filter(u =>
      u.tag.toLowerCase().includes(search2) ||
      u.id === search2);
  }

  /**
   * Finds text channels.
   * @param {String} search Search terms
   * @param {String} id Guild ID
   * @returns {GuildChannel[]}
   */
  findTextChannels(search, id) {
    const search2 = search.toLowerCase();
    return this.client.guilds.get(id).channels
      .filter(c => c.type === 'text')
      .filter(c =>
        c.name.toLowerCase().includes(search2) ||
        c.id === search2);
  }

  /**
   * Finds roles.
   * @param {String} search Search terms
   * @param {String} id Guild ID
   * @returns {Role[]}
   */
  findRoles(search, id) {
    const search2 = search.toLowerCase();
    return this.client.guilds.get(id).roles
      .filter(r => r.name.toLowerCase().includes(search2) || r.id === search2);
  }

  /**
   * Format for member list.
   * @param {GuildMember[]} members Collection of GuildMember
   * @param {String} locale Guild's locale
   * @returns {String}
   */
  formatMembers(members, locale) {
    i18n.setLocale(locale);

    let msg = i18n.__('finder.members.first', {
      warningIcon: this.client.constants.statusEmotes.warning,
      total: members.size,
      list: members.first(5).map(m => `- **${m.user.tag}** (ID:${m.id})`).join('\n'),
    });

    if ((members.size - 5) > 0) {
      msg += `\n${i18n.__('finder.members.second', {
        left: (members.size - 5),
      })}`;
    }

    return msg;
  }

  /**
   * Format for user list.
   * @param {User[]} users Collection of User
   * @param {String} locale Guild's locale
   * @returns {String}
   */
  formatUsers(users, locale) {
    i18n.setLocale(locale);

    let msg = i18n.__('finder.users.first', {
      warningIcon: this.client.constants.statusEmotes.warning,
      total: users.size,
      list: users.first(5).map(u => `- **${u.tag}** (ID:${u.id})`).join('\n'),
    });

    if ((users.size - 5) > 0) {
      msg += `\n${i18n.__('finder.users.second', {
        left: (users.size - 5),
      })}`;
    }

    return msg;
  }
}

module.exports = FinderHelper;
