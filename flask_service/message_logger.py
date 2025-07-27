# flask_service/message_logger.py

from flask import Blueprint, request, jsonify

message_logger = Blueprint("message_logger", __name__)

@message_logger.route("/log-message", methods=["POST"])
def log_message():
    data = request.json
    with open("messages.log", "a") as f:
        f.write(f"{data}\n")
    return jsonify({"status": "message logged"})
