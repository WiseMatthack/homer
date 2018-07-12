const readdir = require('util').promisify(require('fs').readdir);
const Environment = require('../structures/Environment');

/** ****************************************************************
 * Lisa scripting language                                        *
 * Javascript port of jagrosh's JagTag                            *
 * 100% compatiblity with Spectra tags                            *
 * Copyright (c) 2018 - iDroid27210 & John A. Grosh (jagrosh)     *
 ***************************************************************** */

class LisaUtil {
  constructor(client) {
    this.client = client;
    this.maxOutput = 1900;
    this.iterations = 1000;
    this.methods = [];

    this.loadMethods();
  }

  async loadMethods(sandbox = false) {
    const files = await readdir('./src/lisa');
    for (const file of files) {
      const methodFile = require(`../lisa/${file}`);
      if (!sandbox) methodFile.forEach(method => this.methods.push(method));
      delete require.cache[require.resolve(`../lisa/${file}`)];
    }
  }

  async reloadMethods(sandbox = false) {
    if (!sandbox) this.methods = [];
    await this.loadMethods(sandbox);
  }

  async parseString(context, string, type, tagArgs = [], children = false) {
    const env = new Environment(this.client, context, type, tagArgs, children);

    let output = this.filterEscapes(string);
    let lastOutput = null;
    while (output !== lastOutput) {
      lastOutput = output;
      const i1 = output.indexOf('}');
      const i2 = (i1 === -1 ? -1 : output.lastIndexOf('{', i1));

      if (i1 !== -1 && i2 !== -1) {
        const contents = output.substring(i2 + 1, i1);
        let result = null;

        const split = contents.indexOf(':');
        if (split === -1) {
          const name = contents.trim().toLowerCase();
          const method = this.methods.find(m => m.name === name);
          if (method) {
            try {
              result = await method.parseSimple(env);
            } catch (e) {
              result = e.message;
            }
          }
        } else {
          const name = contents.substring(0, split).toLowerCase();
          const params = contents.substring(split + 1).split('|').map(a => this.defilterAll(a));
          const method = this.methods.find(m => m.name === name);
          if (method) {
            try {
              result = await method.parseComplex(env, params);
            } catch (e) {
              result = e.message;
            }
          }
        }

        if (typeof result !== 'string') result = `{${contents}}`;
        output = output.substring(0, i2) + this.filterAll(result) + output.substring(i1 + 1);
      }
    }

    output = this.defilterAll(output);
    if (output.length > this.maxOutput) output = output.substring(0, this.maxOutput);
    return output;
  }

  filterEscapes(string) {
    return string
      .replaceAll('\\{', '\u0012')
      .replaceAll('\\|', '\u0013')
      .replaceAll('\\}', '\u0014');
  }

  defilterEscapes(string) {
    return string
      .replaceAll('\u0012', '\\{')
      .replaceAll('\u0013', '\\|')
      .replaceAll('\u0014', '\\}');
  }

  filterAll(string) {
    return this.filterEscapes(string)
      .replaceAll('{', '\u0015')
      .replaceAll('}', '\u0016');
  }

  defilterAll(string) {
    return this.defilterEscapes(string)
      .replaceAll('\u0015', '{')
      .replaceAll('\u0016', '}');
  }
}

module.exports = LisaUtil;
