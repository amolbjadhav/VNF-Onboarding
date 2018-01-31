from flask import Flask, render_template, send_from_directory
from flask import request
from flask.ext.cors import CORS, cross_origin

from generate_blueprint import create_blueprint_package, cleanup

import os


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
@cross_origin(origin='*')
def generate():
    inputs = request.get_json()
    output_file, workdir = create_blueprint_package(inputs)
    resp = send_from_directory(directory=os.path.dirname(workdir),
                               filename=os.path.basename(output_file),
                               as_attachment=True,
                               attachment_filename=os.path.basename(output_file))
    cleanup(os.path.dirname(workdir))
    return resp

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
