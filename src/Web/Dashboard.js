const Client = require('../Core/Client');
const express = require('express');
const { readdir } = require('fs');
const i18n = require('i18n');

/* Express modules */
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const auth = require('./modules/auth');

/**
 * Represents an instance of the dashboard.
 */
class Dashboard {
  /**
   * @param {Client} client Client that initiated the dashboard
   * @param {DashboardSettings} dashboardSettings Settings for the dashboard
   */
  constructor(client, dashboardSettings) {
    /**
     * Client that initiated the dashboard.
     * @type {Client}
     */
    this.client = client;

    /**
     * Settings of the dashboard.
     * @type {DashboardSettings}
     */
    this.dashboardSettings = dashboardSettings;

    /**
     * Express application which handles the dashboard.
     */
    this.app = express();
    this._initApp();
    this._loadRoutes();

    /**
     * Express server (inherited from the `this.app.listen` method).
     */
    this.server = this.listen(this.dashboardSettings.port);
  }

  /**
   * Imports all modules, etc. for the express application.
   * @private
   */
  _initApp() {
    this.app
      .enable('trust proxy')
      .use(express.static(`${__dirname}/public`))
      .use(bodyParser.urlencoded({
        extended: false,
      }))
      .use(cookieParser(this.dashboardSettings.sessionSecret))
      .use(expressSession({
        secret: this.dashboardSettings.sessionSecret,
        resave: true,
        saveUninitialized: true,
        proxy: true,
      }))
      .use(auth.initialize())
      .use(auth.session())
      .use(i18n.init)
      .use(this.globalVars)
      .set('view engine', 'pug')
      .set('views', `${__dirname}/views`);
  }

  /**
   * Loads all dynamic routes
   * @private
   */
  _loadRoutes() {
    readdir(`${__dirname}/routes`, (err, files) => {
      if (err) console.error(err);

      for (const route of files) {
        const routeFile = require(`./routes/${route}`);
        this.app.use(`/${route.split('.')[0]}`, routeFile);
      }
    });

    this.app.get('/', (req, res) => res.render('index.pug'));
  }

  /**
   * Implements global variables.
   * @param {*} request Express request
   * @param {*} response Express response
   * @param {*} next Next
   */
  globalVars(request, response, next) {
    const data = {
      authenticated: request.isAuthenticated(),
      locale: request.language,
      nameDisplay: request.isAuthenticated() ? request.__('dashboard.nameDisplay.connected', {
        username: request.user.username,
        discriminator: request.user.discriminator,
      }) : request.__('dashboard.nameDisplay.visitor'),
    };

    Object.keys(data).forEach((key) => {
      request[key] = data[key];
      request.res[key] = data[key];
      response[key] = data[key];
      response.locals[key] = data[key];
    });

    next();
  }

  /**
   * Makes the dashboard listen to the given port.
   * @param {Number} port Port to listen on
   * @returns Express server
   */
  listen(port) {
    return this.app.listen(port, (err) => {
      if (err) console.error(err);
      console.log(`[Express] Listening on ${port}.`);
    });
  }

  /**
   * Gracefully shutdown the dashboard.
   */
  async shutdown() {
    return new Promise(resolve => this.server.close(resolve));
  }
}

module.exports = Dashboard;
