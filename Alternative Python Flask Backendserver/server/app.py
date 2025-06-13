from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URL"))
db = client.chat_app

online_users = {}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('add-user')
def handle_add_user(user_id):
    online_users[user_id] = request.sid
    emit('online-users', list(online_users.keys()), broadcast=True)

@socketio.on('send-msg')
def handle_send_msg(data):
    recipient_sid = online_users.get(data['to'])
    if recipient_sid:
        emit('msg-receive', {
            'from': data['from'],
            'message': data['message']
        }, room=recipient_sid)

@socketio.on('disconnect')
def handle_disconnect():
    for user_id, sid in list(online_users.items()):
        if sid == request.sid:
            del online_users[user_id]
            emit('online-users', list(online_users.keys()), broadcast=True)
            break

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
