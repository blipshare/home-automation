from os import path, listdir, getenv
import argparse
import numpy as np
import face_recognition 
#import pyarrow as pa
#import pyarrow.parquet as pq
import pandas as pd
import pickle as pkl

class FR:
    def __init__(self, embeddings_path, img_path):
        self.embeddings_path = embeddings_path
        self.img_path = img_path


    def read_known_embeddings(self):
        self.known_embeddings = []
        if path.exists(self.embeddings_path):
            for emb_file in listdir(self.embeddings_path):                
                self.known_embeddings.append(pd.read_pickle(path.join(self.embeddings_path, emb_file))) 
            

    def generate_facial_encoding(self, save_enc=False, user=None):
        if path.exists(self.img_path):
            unknown_person_img = face_recognition.load_image_file(self.img_path)
            face_locations = face_recognition.face_locations(unknown_person_img)
            uknown_face_encodings = face_recognition.face_encodings(unknown_person_img, known_face_locations=face_locations)
            if len(unknown_face_encodings) > 0:
                self.unknown_face_encoding = unknown_face_encodings[0]

                # save if requested
                if save_enc and user is not None:
                    embedding_path = path.join(self.embeddings_path, "%s.pkl" % user)
                    print(embedding_path)
                    with open(embedding_path,'wb') as f:
                        pkl.dump(self.unknown_face_encoding, f)


    def compare_faces(self):
        if len(self.unknown_face_encodings) > 0:
            results = face_recognition.compare_faces(self.known_embeddings, self.unknown_face_encodings[0], tolerance=0.6)
            return True, results.index(True) 
        return False, 'Unidentified'

def verify_person(img_path):
    embeddings_path = getenv('KNOWN_EMBEDDINGS')
    if embeddings_path is not None:
    	fr = FR(embeddings_path, img_path)
    	fr.read_known_embeddings()
    	fr.generate_facial_encoding() 
    	return fr.compare_faces()

    return False, 'No Embeddings Found'
