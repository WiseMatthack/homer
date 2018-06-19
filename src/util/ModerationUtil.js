const XRegExp = require('xregexp');

class ModerationUtil {
  constructor(client) {
    this.client = client;
    this.searchExpression = /(?:<@|<@!|)(\d{17,19})(?:>|)/g;
    this.timeExpression = new XRegExp('(?is)^((\\s*-?\\s*\\d+\\s*(y(ears?)?|d(ays?)?|h((ou)?rs?)?|m(in(ute)?s?)?|s(ec(ond)?s?)?)\\s*,?\\s*(and)?)*).*');
  }

  async parseArgs(string, guild, duration = false) {
    const members = [];
    const users = [];
    let time = 0;
    let done = true;

    while (string.length > 0 && done) {
      done = false;

      // Search
      const searchTest = this.searchExpression.exec(string);
      if (searchTest) {
        const userID = searchTest[1];
        const member = guild.members.get(userID) || await guild.fetchMember(userID).catch(() => null);
        if (member) {
          members.push(member);
        } else {
          const user = await this.client.fetchUser(userID).catch(() => null);
          if (user) users.push(user);
        }
        string = string.substring(searchTest[0].length).trim();
        this.searchExpression.lastIndex = 0;
        done = true;
      }
    }

    if (duration) {
      const timeTest = this.timeExpression.exec(string);
      if (timeTest && timeTest[1] !== '') {
        const timeString = timeTest[1];
        string = string.substring(timeString.length).trim();
        time = this.client.time.parseDuration(timeString);
      }
    }

    return ({
      members,
      users,
      time,
      reason: string,
      empty: (members.length === 0 && users.length === 0),
    });
  }
}

module.exports = ModerationUtil;
