#!/usr/bin/env/python

import argparse
from jinja2 import Template
import os
import requests
import shutil
import validators
import tempfile
import yaml

TEMPLATES_DIR = 'templates'
TEMPLATES = {'OpenStack': 'OS-template.yaml',
             'TOSCA_OpenStack': 'OS-TOSCA-template.yaml',
             'OSM_OpenStack': 'OS-OSM-template.yaml',
             'vCloud Director': 'VCD-template.yaml',
             'TOSCA_vCloud Director': 'VCD-TOSCA-template.yaml',
             'OSM_vCloud Director': 'VCD-OSM-template.yaml',
             'VIO': 'VIO-template.yaml',
             'TOSCA_VIO': 'VIO-TOSCA-template.yaml',
             'OSM_VIO': 'VIO-OSM-template.yaml'}


def parse_argv():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--inputs', required=True, metavar='<inputs_file_path>')
    return parser.parse_args()


def gen_name_and_workdir(inputs):
    params = inputs['params']
    name = params['vnf_name'] + '-' + params['env_type']
    workdir = os.path.join(tempfile.mkdtemp(), name)
    return name, workdir


def get_template(template_file):
    with open(template_file) as f:
        text = f.read()
    return Template(text)


def copy_README(inputs, workdir):
    README = 'README.md'
    template_file = os.path.join(TEMPLATES_DIR, README)
    with open(template_file) as f:
        text = f.read()
    rendered = Template(text).render(inputs['params'])
    out_file = os.path.join(workdir, README)
    with open(out_file, 'w') as f:
        f.write(rendered)


def get_file_from_url(url):
    return requests.get(url).text, ('.' + url).split('.')[-1]


def write_scripts_file(working_dir, script_phase, ext, body):
    if ext:
        ext = '.' + ext
    path = os.path.join(working_dir, script_phase + ext)
    with open(path, 'w') as f:
        f.write(body)
    return path


def create_work_dir(workdir):
    os.mkdir(workdir)


def cleanup(workdir):
    shutil.rmtree(workdir)


def create_package(name, workdir):
    shutil.make_archive(
        os.path.abspath(workdir),
        'zip',
        os.path.dirname(workdir),
        name)
    return workdir + '.zip'

def get_orch_types(params):
     orch = params['orch_type']
     return orch 

def add_scripts(params, workdir):
    params['scripts'] = None if all(not s for p, s in params['scripts'].iteritems()) else params['scripts']
    scripts = params['scripts']
    if scripts:
        scripts_dir = os.path.join(workdir, 'scripts')
        os.mkdir(scripts_dir)
        for phase, script in scripts.iteritems():
            if script:
                if validators.url(script):
                    body, ext = get_file_from_url(script)
                else:
                    body, ext = script, ''
                write_scripts_file(scripts_dir, phase, ext, body)
                params['scripts'][phase] = os.path.join('scripts', phase + '.' + ext)

   
def generate_cloudify_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES[params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_osm_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['OSM_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-OSM.yaml')
    with open(out_file, 'w') as f:
        f.write(out)

def generate_standard_tosca_blueprint(params, workdir, name):
    template = get_template(os.path.join(TEMPLATES_DIR, TEMPLATES['TOSCA_' + params['env_type']]))
    out = template.render(params)
    out_file = os.path.join(workdir, name + '-TOSCA.yaml')
    with open(out_file, 'w') as f:
        f.write(out)
    shutil.copytree(os.path.join(TEMPLATES_DIR, 'types'), os.path.join(workdir, 'types'))


def copy_inputs_template(params, workdir):
    inputs_name = params['env_type'] + '-inputs.yaml'
    shutil.copyfile(os.path.join(TEMPLATES_DIR, inputs_name), os.path.join(workdir, inputs_name))


def remove_file(filepath):
    os.remove(filepath)


def create_blueprint_package(inputs):
    name, workdir = gen_name_and_workdir(inputs)
    try:
        create_work_dir(workdir)
        add_scripts(inputs['params'], workdir)
        copy_README(inputs, workdir)
        print "The input parameter is ", get_orch_types(inputs['params']) 
        print "The input list parameter is ", inputs['params'] 
        if get_orch_types(inputs['params']) == 'Cloudify 3.4': 
            generate_cloudify_blueprint(inputs['params'], workdir, name)
            copy_inputs_template(inputs['params'], workdir)
            output_file = create_package(name, workdir)
            return output_file, workdir
        elif get_orch_types(inputs['params']) == 'OSM 3.0':
           generate_standard_osm_blueprint(inputs['params'], workdir, name)
           copy_inputs_template(inputs['params'], workdir)
           output_file = create_package(name, workdir)
           return output_file, workdir
        elif get_orch_types(inputs['params']) == 'TOSCA 1.1':
           generate_standard_tosca_blueprint(inputs['params'], workdir, name)
           copy_inputs_template(inputs['params'], workdir)
           output_file = create_package(name, workdir)
           return output_file, workdir
    finally:
        cleanup(workdir)

if __name__ == '__main__':
    args = parse_argv()
    with open(args.inputs) as f:
        inputs = yaml.load(f.read())
        output_file, workdir = create_blueprint_package(inputs)
        cleanup(workdir)
