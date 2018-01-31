/**
 * Created by jakub on 1/26/17.
 */

module.exports = function (dataService, $state) {
    "ngInject";

    this.currPath = 0;

    this.changeRoute = function( pathId ) {
      this.currPath = pathId;
      this.updatePath()
    };

    this.links = [
      {name: 'VNF definitions', href: 'wizard.vnf', button:'Continue'},
      {name: 'NIC Definitions', href: 'wizard.nic_definitions', button: 'Continue'},
      {name: 'Scripts', href: 'wizard.scripts', button: 'Continue'},
      {name: 'Summary', href: 'wizard.summary', button: 'Generate'},
      {name: 'Generate', href: 'wizard.generate', button: 'Create new'}
    ];

    this.prevPath = function(){
      dataService.update();

      this.currPath = this.currPath - 1;
      this.updatePath()
    };

    this.nextPath = function() {
      if( dataService.update() ) {
        if (this.currPath + 1 === this.links.length) {
          this.currPath = 0;
          dataService.populateData();
        } else {
          this.currPath = this.currPath + 1;
        }

        this.updatePath()
      }
    };

    this.updatePath = function()  {
      $state.go(this.links[this.currPath].href);
    }
};
