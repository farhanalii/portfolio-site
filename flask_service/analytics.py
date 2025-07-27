# flask_service/analytics.py

from flask import Blueprint, request, jsonify
from datetime import datetime

analytics = Blueprint("analytics", __name__)
visit_log = "visits.log"

@analytics.route("/track", methods=["POST"])
def track():
    data = request.json
    data["timestamp"] = datetime.utcnow().isoformat()
    with open(visit_log, "a") as f:
        f.write(f"{data}\n")
    return jsonify({"status": "visit logged"})

@analytics.route("/stats", methods=["GET"])
def stats():
    try:
        with open(visit_log, "r") as f:
            lines = f.readlines()
        return jsonify({"visits": len(lines)})
    except FileNotFoundError:
        return jsonify({"visits": 0})
