const angular = require('angular');
require('angular-ui-router');

/* Clarity */
require('mutationobserver-shim');
require('@webcomponents/custom-elements');
require('clarity-icons');

/* Config */
const routesConfig = require('./routes');

/* Components */
const wizardComponent = require('./app/components/steps_component');
const vnfComponent = require('./app/components/vnf_definition_component');
const nicComponent = require('./app/components/nic_definitions_component');
const scriptsComponent = require('./app/components/scripts_definitions_component');
const summaryComponent = require('./app/components/summary_component');
const rangeComponent = require('./app/components/range_component');
const generateComponent = require('./app/components/generate_component');

/* Services */
const dataService = require('./app/services/data_service');
const navigationService = require('./app/services/navigation_service');

/* CSS */
require('./index.scss');
require('clarity-icons/clarity-icons.min.css');
require('clarity-ui/clarity-ui.min.css');

module.exports = angular
  .module('app', ['ui.router'])
  .config(routesConfig)
  .service('navigationService', navigationService)
  .service('dataService', dataService)
  .component('wizard', wizardComponent)
  .component('vnf', vnfComponent)
  .component('nic', nicComponent)
  .component('scripts', scriptsComponent)
  .component('summary', summaryComponent)
  .component('range', rangeComponent)
  .component('generate', generateComponent)
  .name
;
