const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/scripts_definitions.html'),
  controller: function (dataService) {
    "ngInject";

    this.DEFAULT_INPUT_TYPE = 'url';
    this.INPUT_PLACEHOLDER = 'Type here';
    this.FORM_SUBMIT_CLASS = '';
    this.TOOLTIP = TOOLTIPS.GENERAL_SCRIPTS;

    this.scriptsInputs = dataService.getScripts();

    this.empty = function (x) {
      return x == undefined || x === '' || x == null;
    };

    function emptyToString (x) {
      return x == undefined || x == null ? '' : x;
    }

    this.forms = {};

    dataService.setSubmitCallback(() => {
      this.FORM_SUBMIT_CLASS = 'submit';
      const isValid = this.forms.scriptsForm.$valid;

    if (isValid === true) {

      const config = {
          create: emptyToString(this.scriptsInputs['create'].value),
          config: emptyToString(this.scriptsInputs['configure'].value),
          delete: emptyToString(this.scriptsInputs['delete'].value)
        };

        dataService.setScripts(config);
      }

      return isValid;
    });
  }
};
