module.exports = {
  template: require('../templates/wizard.html'),
  controller: function (navigationService) {
    "ngInject";

    this.navigationService = navigationService;
  }
};
