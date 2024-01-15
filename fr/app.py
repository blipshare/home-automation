from flask import Flask, request, jsonify
from inference import FR
from PIL import Image
import json
import base64
import io

app = Flask("Face Rocognizer")

@app.route('/', methods=['GET', 'POST'])
def home():
    return jsonify({'status': 'ok', 'data': 'Welcome to face recognition model'})

@app.route('/recognize', methods=['GET', 'POST'])
def recognize():
    '''
    Description: Function to listen for user request with json parameters to recognize user face.
    It takes in the following parameters:
    img_path: Absolute path to the image
    @return: jsonify string.
    '''

    content_type = request.headers.get('Content-Type')
    status = 'unavailable'
    if (content_type == 'application/json'):
        json = request.json
        if json and 'img_path' in json:
            img_path = json['img_path']
            fr = FR("/app/data/known_embeddings", img_path)
            success, person = fr.verify_person(img_path)
            if success:
                status = 'ok'
            return jsonify({'status': status, 'data': person})

    return jsonify({'status': status, 'data': 'unavailable'})

@app.route('/addUser', methods=['GET', 'POST'])
def addUser():
    '''
    Description: Function to listen for user request with json parameters to add a user.
    It takes in the following parameters:
    data: dictionary of the user and raw photo data
    @return: jsonify string.
    '''

    content_type = request.headers.get('Content-Type')
    print(content_type)
    status = 'unavailable'
    if (content_type == 'application/json'):
        json = request.json
        print(json)
        if json and 'data' in json:
            data = json['data']
            user = data['user']
            photoData = data['rawPhotoData']
            decoded_string = io.BytesIO(base64.b64decode(photoData))            
            print(decoded_string)
            img = Image.open(decoded_string)
            #img = Image.open(photoData)
            img_path = "/app/raw_data/data.jpg"
            img.save("/app/raw_data/data.jpg")

            #img = Image.frombytes('RGB', (640, 480), base64.b64decode(base64_string), 'raw')

            fr = FR("/app/known_embeddings", img_path)
            success, person = fr.generate_facial_encoding(save_enc=True)
            if success:
                status = 'ok'
            return jsonify({'status': status, 'data': person})

    return jsonify({'status': status, 'data': 'unavailable'})
