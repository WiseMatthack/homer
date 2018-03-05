const Client = require('../Core/Client');
const express = require('express');
const { readdir } = require('fs');

/* Express modules */
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

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
    _initApp();
    _loadRoutes();

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
        this.app.use(route, routeFile);
      }
    });
  }

  /**
   * Makes the dashboard listen to the given port.
   * @param {Number} port Port to listen on
   * @returns Express server
   */
  listen(port) {
    return this.app.listen(port, (err) => {
      if (err) console.error(err);
      console.loh(`[Express] Listening on ${port}.`);
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
