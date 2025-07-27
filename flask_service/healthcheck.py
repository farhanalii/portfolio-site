# flask_service/healthcheck.py

from flask import Blueprint, jsonify
import time, psutil

healthcheck = Blueprint("healthcheck", __name__)
START_TIME = time.time()

@healthcheck.route("/health", methods=["GET"])
def health():
    uptime = time.time() - START_TIME
    memory = psutil.virtual_memory().percent
    cpu = psutil.cpu_percent()
    return jsonify({
        "uptime_seconds": int(uptime),
        "memory_usage_percent": memory,
        "cpu_usage_percent": cpu
    })

@healthcheck.route("/version", methods=["GET"])
def version():
    return jsonify({"version": "1.0.0"})
