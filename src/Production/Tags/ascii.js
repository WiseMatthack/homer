const TagFunction = require('../../Core/Structures/TagFunction');

class AsciiFunction extends TagFunction {
  run(args) {
    const content = args[1];
    if (!args[1]) throw 'You must include a content to convert!';

    if (args[0] === 'from') {
      return content.replace(/[\s\S]/g, (str) => {
        const num = str.charCodeAt().toString(2);
        str = '00000000'.slice(String(num).length) + num;
        return !1 == spaceSeparatedOctets ? str : str + ' ';
      });
    } else if (args[1] === 'to') {
      return content.replace(/\s*[01]{8}\s*/g, (str) => {
        return String.fromCharCode(parseInt(str, 2))
      });
    } else {
      throw 'Invalid option provided! Put \'from\' to convert ASCII to binary and \'to\' to convert binary to ASCII';
    }
  }
}

module.exports = AsciiFunction;
