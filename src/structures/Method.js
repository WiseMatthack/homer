class Method {
  constructor(name, simple, complex) {
    this.name = name;
    this.simple = simple;
    this.complex = complex;
  }

  parseSimple(env) {
    return this.simple ? this.simple(env) : null;
  }

  parseComplex(env, params) {
    return this.complex ? this.complex(env, params) : null;
  }
}

module.exports = Method;
