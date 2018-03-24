const TagFunction = require('../../Core/Structures/TagFunction');

class IfFunction extends TagFunction {
  run(args) {
    if (args.length !== 5) throw new Error('Your if condition must look like this: "if{condition1|comparator|condition2|trueCase|falseCase}".');

    let caseBoolean = false;
    if (args[1] === '=') caseBoolean = (args[0] === args[2]);
    else if (args[1] === '<') caseBoolean = (args[0] < args[2]);
    else if (args[1] === '<=') caseBoolean = (args[0] <= args[2]);
    else if (args[1] === '>') caseBoolean = (args[0] > args[2]);
    else if (args[1] === '>=') caseBoolean = (args[0] >= args[2]);

    if (caseBoolean) return args[3];
    return args[4];
  }
}

module.exports = IfFunction;
