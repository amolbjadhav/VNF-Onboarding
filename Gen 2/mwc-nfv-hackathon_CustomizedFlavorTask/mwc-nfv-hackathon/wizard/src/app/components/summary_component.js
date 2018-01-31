module.exports = {
  template: require('../templates/summary.html'),
  controller: function (dataService) {
    "ngInject";

    dataService.setSubmitCallback(function () {
      return true;
    });

    this.inputs = dataService.generateInputs();

    this.inputsNames = {
      'env_type': 'VIM Type',
      'vnf_type': 'VNF Type',
      'orch_type': 'Orchestrator Type',
      'upload_file': 'Upload File',
      'vnf_name': 'VNF Name',
      'vnf_description': 'VNF Description',
      'cpu': 'vCPU',
      'ram': 'RAM (MB)',
      'disk': 'Disk',
      'image_id': 'Image',
      'flavor': 'Flavor',
      'config': 'Configure Script url',
      'create': 'Create Script url',
      'delete': 'Delete Script url',
      'nic1_name': 'NIC 1',
      'nic2_name': 'NIC 2',
      'nic3_name': 'NIC 3',
      'nic4_name': 'NIC 4',
      'nic5_name': 'NIC 5'
    };
      }
};
