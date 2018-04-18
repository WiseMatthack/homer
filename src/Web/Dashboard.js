const express = require('express');
const { readdir } = require('fs');
const i18n = require('i18n');
const path = require('path');
const cookieParser = require('cookie-parser');

/**
 * Represents an instance of the dashboard.
 * Note: all "static" content is deserved by the Apache server (performance),
 * so it will not be available here.
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
      .use(cookieParser(this.client.config.dashboard.sessionSecret))
      .use(i18n.init)
      .use((req, res, next) => {
        const locales = i18n.getLocales().map(locale => ({
          code: i18n.getCatalog(locale)['lang.code'],
          name: i18n.getCatalog(locale)['lang.fullName'],
        }));

        req.locales = locales;
        req.res.locales = locales;
        res.locales = locales;
        res.locals.locales = locales;
        next();
      })
      .set('view engine', 'pug')
      .set('views', path.join(`${__dirname}/views`));
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
    this.app.use(express.static(path.join(`${__dirname}/static`)));
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
