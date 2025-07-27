# flask_service/app.py

from flask import Flask
from message_logger import message_logger
from analytics import analytics
from healthcheck import healthcheck

app = Flask(__name__)
app.register_blueprint(message_logger)
app.register_blueprint(analytics)
app.register_blueprint(healthcheck)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
