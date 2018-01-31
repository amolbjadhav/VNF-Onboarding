const TOOLTIPS = require('../config/tooltips.json');
const FLAVORS = require('../config/flavors.json');
const VNF_TYPES = require('../config/vnf_types.json');

module.exports = function ($http) {
  "ngInject";

  let _vnfDefinition = {};
  let _nicDefinition = {};
  let _scriptsDefinition = {};
  let _scripts = {};

  const _vnfTypes = VNF_TYPES;
  const _vCPUs = [1, 2, 4, 8, 16];
  const _RAMs = [1, 2, 4, 8, 16, 32, 64, 128, 256];
  const _Flavors = FLAVORS;

  this.populateData = function() {
    _vnfDefinition = {
      VIMType: 'vCloud Director',
      OrchType: 'TOSCA 1.1',
      OType: 'T.1',
      VNFType: 'vRouter',
      VNFDescription: '',
      uploadfile: '',
      vCPU: 0,
      RAM: "1",
      Disk: '',
      Image: '',
      Flavor: 0
    };

    _nicDefinition = {
      numberOfNICs: 3,
      NICs: ['', '', '', '', '', '', ''],
      NICsIndices: [0, 1, 2, 3, 4, 5, 6]
    };

    _scripts = {
      'create': {
        text: "Create Script url",
        tooltip: TOOLTIPS.CREATE,
        id: 'create_url',
        name: 'create', value: ''
      },
      'configure': {
        text: "Configure Script url",
        tooltip: TOOLTIPS.CONFIGURE,
        id: 'configure_url',
        name: 'configure', value: ''
      },
      'delete': {
        text: "Delete Script url",
        tooltip: TOOLTIPS.DELETE,
        id: 'delete_url',
        name: 'delete', value: ''
      }
 };

    let _scriptsDefinition = {};
  };

  this.populateData();

  this.update = function () {
    return true;
  };

  this.setSubmitCallback = function (callback) {
    this.update = callback;
  };

  this.getScripts = function () {
    return _scripts;
  };

  this.setVNF = function (vnf) {
    _vnfDefinition = vnf;
  };
  this.setNICs = function (nics) {
    _nicDefinition = nics;
  };
  this.setScripts = function (scripts) {
    _scriptsDefinition = scripts;
  };

  this.getVnfDefinition = function () {
    return _vnfDefinition;
  };
  this.getNicDefintion = function () {
    return _nicDefinition;
  };
  this.getScriptsDefinition = function () {
    return _scriptsDefinition;
  };
  this.getVCPUs = function () {
    return _vCPUs;
  };
  this.getRAMs = function () {
    return _RAMs;
  };
  this.getFlavors = function () {
    return _Flavors;
  };
  this.getVNFTypes = function () {
    return _vnfTypes;
  };

   this.sendData = function (callback) {
    $http({
      method: 'POST',
      url: 'http://' + location.hostname + ':5000',
      enctype: 'multipart/form-data',      
      responseType: 'arraybuffer',
      data: this.generateInputs()
    }).then(function successCallback(response) {
      var name = _vnfDefinition.VNFType + '-' + _vnfDefinition.VIMType + '.zip'
      callback(response.data, name);
    }, function errorCallback(response) {
      console.error(response);
    });
 };

   this.saveFile = function (callback) {
    $http({
      method: 'POST',
      url: 'http://' + location.hostname + ':5000',
      responseType: 'filebuffer',
      Filedata: this.generateInputs()
    }).then(function successCallback(response) {
      var name = _vnfDefinition.VNFType + '-' + _vnfDefinition.VIMType + '.zip'
      callback(response.data, name);
    }, function errorCallback(response) {
      console.log(response);
      console.error(response);
    });
  };
 
  this.generateInputs = function () {
    const inputs = {
      params: {
        env_type: _vnfDefinition.VIMType,
        orch_type: _vnfDefinition.OrchType,
        o_type: _vnfDefinition.OType,
        vnf_name: _vnfDefinition.VNFType,
        vnf_type: _vnfDefinition.VNFType,
        vnf_description: _vnfDefinition.VNFDescription,
        upload_file: _vnfDefinition.uploadfile,
        cpu: _vCPUs[_vnfDefinition.vCPU],
        disk: _vnfDefinition.Disk,
        ram: _vnfDefinition.RAM * 1024,
        image_id: _vnfDefinition.Image,
        flavor: _vnfDefinition.Flavor,
        scripts: _scriptsDefinition
      }
    };
    for (let i = 0; i <_nicDefinition.NICs.length; i++){
      if (_nicDefinition.NICs[i]){
        inputs['params']['nic' + (_nicDefinition.NICsIndices[i] + 1) + '_name'] = _nicDefinition.NICs[i];
      }
    }
    console.log(inputs)
    return inputs;
  };
};
