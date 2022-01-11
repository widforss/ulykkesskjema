from flask import Flask, Response, request
from waitress import serve
import requests
from regobslib import *
from regobslib.connection import API_TEST

app = Flask(__name__, static_folder='../static', static_url_path='/static')

# Contact regobs@nve.no to get a client ID.
CLIENT_ID = "00000000-0000-0000-0000-000000000000"

# Create a user at https://test-konto.nve.no/ or https://konto.nve.no/
USERNAME = "ola.nordmann@example.com"
PASSWORD = "P4ssw0rd1"

@app.route("/")
def index():
    return app.send_static_file("html/main.html")


@app.route("/api/registration", methods=["POST"])
def registration():
    json = request.get_json(force=True)

    session = Connection(prod=False).authenticate(USERNAME, PASSWORD, CLIENT_ID).session
    response = session.post(f"{API_TEST}/Registration", json=json)
    if response.status_code != 200:
        print(response.content)
        return Response(status=500)
    return response.content


@app.route("/api/attachment", methods=["POST"])
def attachment():
    connection = Connection(prod=False).authenticate(USERNAME, PASSWORD, CLIENT_ID)
    file = request.files["file"]
    body = {"file": (file.filename, file, file.mimetype)}
    img_id = connection.session.post(f"{API_TEST}/Attachment/Upload", files=body)
    if img_id.status_code != 200:
        return Response(status=500)
    return img_id.content

#@app.route("/api/attachment/<", methods=["GET"])
#    get_attachment():
#        requests.get(f"{API_TEST}/Attachments/Thumbnail/")

if __name__ == '__main__':
    print("serving")
    serve(app, host='0.0.0.0', port=12345)