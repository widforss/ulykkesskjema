import imghdr
import re
import datetime as dt
from typing import Optional, List, Dict

import requests
from flask import Flask, Response, request
from waitress import serve
import logging
import logging.handlers
from regobslib import *
from regobslib.connection import API_TEST


handler = logging.handlers.TimedRotatingFileHandler("logs/ulykkesskjema.log", when="midnight", backupCount=7)
formatter = logging.Formatter('[%(asctime)s]\t%(levelname)s:\t%(message)s', datefmt='%Y-%m-%d %H:%M:%S')
handler.setFormatter(formatter)
logger = logging.getLogger('Logger')
logger.setLevel(logging.INFO)
logger.addHandler(handler)

app = Flask(__name__, static_folder='../static', static_url_path='/static')

# Contact regobs@nve.no to get a client ID.
CLIENT_ID = "00000000-0000-0000-0000-000000000000"

# Create a user at https://test-konto.nve.no/ or https://konto.nve.no/
USERNAME = "ola.nordmann@example.com"
PASSWORD = "P4ssw0rd1"

CAPTCHA_SECRET = ""
CAPTCHA_SERVER = "https://www.google.com/recaptcha/api/siteverify"

REGISTRATION_IP = {}
IMAGE_IP = {}
IMAGE_PER_HOUR = 15
REG_PER_HOUR = 5


def rate_limit(ip: str, rate: int, ips: Dict[str, List[dt.datetime]]) -> Optional[Response]:
    ips[ip] = [
        l for l in (ips[ip] if ip in ips else [])
        if dt.datetime.now() - l < dt.timedelta(hours=1)
    ]
    if len(ips[ip]) >= rate:
        return Response(status=429)
    ips[ip].append(dt.datetime.now())


def log(request: request, msg: Optional[str] = None, level: int = logging.INFO):
    ip = request.remote_addr
    referer = request.headers.get("Referer")
    ua = request.headers.get('User-Agent')
    log_items = [ip, referer, ua] + [msg] if msg else []
    logger.log(level, "\t".join(log_items))


@app.route("/")
def index():
    return app.send_static_file("html/main.html")


@app.route("/api/registration", methods=["POST"])
def registration():
    log(request, request.url)
    rate_response = rate_limit(request.remote_addr, REG_PER_HOUR, REGISTRATION_IP)
    if rate_response:
        log(request, "Rate limit exceeded")
        return rate_response

    json = request.get_json(force=True)
    reg = json["reg"]
    captcha_response = json["captcha"]

    captcha_body = {
        "secret": CAPTCHA_SECRET,
        "response": captcha_response,
        "remoteip": request.remote_addr,
    }
    captcha_verification = requests.post(CAPTCHA_SERVER, data=captcha_body).json()
    if not captcha_verification["success"]:
        log(request, "Captcha was unsuccessful", logging.WARNING)
        return Response(status=403)

    session = Connection(prod=False).authenticate(USERNAME, PASSWORD, CLIENT_ID).session
    response = session.post(f"{API_TEST}/Registration", json=reg)
    if response.status_code != 200:
        log(request, "Registration rejected by API", logging.WARNING)
        return Response(status=500)

    log(request, f"Registration ID: {response.json()['RegId']}")
    return response.content


@app.route("/api/attachment", methods=["POST"])
def attachment():
    log(request, request.url)
    rate_response = rate_limit(request.remote_addr, IMAGE_PER_HOUR, IMAGE_IP)
    if rate_response:
        log(request, "Rate limit exceeded")
        return rate_response

    file = request.files["file"]
    mime = imghdr.what(file)
    mime_match = re.search(r"(?<=image/)[a-z]*$", file.mimetype)
    alleged_mime = mime_match[0] if mime_match else None
    if not mime or not (mime == 'jpeg' or mime == 'png') or mime != alleged_mime:
        log(request, "Invalid attachment", logging.WARNING)
        return Response(status=400)

    body = {"file": (file.filename, file, file.mimetype)}
    conn = Connection(prod=False).authenticate(USERNAME, PASSWORD, CLIENT_ID)
    img_id = conn.session.post(f"{API_TEST}/Attachment/Upload", files=body)
    if img_id.status_code != 200:
        log(request, "Attachment rejected by API", logging.WARNING)
        return Response(status=500)

    log(request, f"Attachment ID: {img_id.content}")
    return img_id.content

if __name__ == '__main__':
    print("serving")
    serve(app, host='0.0.0.0', port=12345)
