const Method = require('../structures/Method');

module.exports = [
  // set
  new Method(
    'set',
    null,
    (env, params) => {
      env.vars[params[0]] = params[1];
      return '';
    },
  ),

  // get
  new Method(
    'get',
    null,
    (env, params) => env.vars[params[0]] || '',
  ),
];
