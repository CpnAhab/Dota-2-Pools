import os
from flask import Flask, flash, render_template, request, session, redirect, send_file, send_from_directory, jsonify
from flask_restful import Api, Resource, reqparse
import random
import psycopg2

# UNCOMMENT FOR HOSTING
# DB_URL = os.environ['DATABASE_URL']

def connect(url: str):
    conn = psycopg2.connect(url, sslmode="require")
    curs = conn.cursor()
    return conn, curs

def close(conn, curs):
    conn.commit()
    conn.close()
    curs.close()

app = Flask(__name__, static_url_path = '/', static_folder = "ui/build")

@app.route("/")
def index():
    return app.send_static_file('index.html')

#Unused w/ react.
@app.route("/test", methods=["POST"])
def populate_test():
    test = request.get_json()
    print(format(test))
    response = {"str": "str", 'agi':"agi", 'int':"int", 'test': 'boop'}
    return response

@app.route("/api/heroes")
def populate():

    conn, curs = connect(DB_URL)
    attributes = get_attributes(curs)

    hero_list = dict()

    for a in attributes:
        query = """SELECT internalname FROM heroes
            INNER JOIN attributes ON heroes.attrID = attributes.id
            WHERE attributes.attribute = %s
            ORDER BY heroes.id"""

        curs.execute(query, (a,))
        result = [x[0] for x in curs.fetchall()]
        hero_list[a] = result
    
    close(conn, curs)

    resp = jsonify(hero_list)
    return resp

@app.route("/api/random", methods=["POST"])
def to_random():
    selected = request.get_json()

    if selected['checkedHeroes'] and len(selected['checkedHeroes']) > 0:
        return {"choice" : translate_names([random.choice(selected['checkedHeroes'])])}
    else:
        return {"choice" : "None found"}

@app.route("/api/to_text", methods=["POST"])
def to_text():
    selected = request.get_json()

    if selected['checkedHeroes'] and len(selected['checkedHeroes']) > 0:
        return {"choice" : translate_names(selected['checkedHeroes'])}
    else:
        return {"choice" : "None found"}

@app.route("/api/download", methods=["POST"])
def download():
    selected = request.get_json()

    path = "hero_pool.txt"
    if selected['checkedHeroes'] and len(selected['checkedHeroes']) > 0:
        with open(path, 'w') as f:
            f.write(", ".join(selected["checkedHeroes"]))
        return send_file(path, as_attachment=True)

    else:
        message = "No heroes selected."
        return {"message" : message}

@app.route("/api/load", methods=["POST"])
def load_pool():
    user = request.get_json()['user']

    if user:

        query = """SELECT pool FROM userpools
            WHERE username = %s"""

        # CLEAN THE INPUT BEFORE PUSHING
        conn, curs = connect(DB_URL)
        curs.execute(query, (user,))
        # IT IS HIGHLY LIKELY THAT THIS RETURNS AN OBJECT THAT IS NOT PARTICULARLY PARSABLE BY REACT
        result = curs.fetchone()
        close(conn, curs)

        return {"pool": result}

    else:
        # Decide how this is formatted.
        return {"pool": []}

@app.route("/api/save", methods=["POST"])
def save_pool():
    
    response = request.get_json()
    user = response['user']
    # Formatting pool as an array of integer indices right now
    pool = response['pool']

    if user and pool:

        query = """SELECT id FROM userpools
            WHERE username = %s"""

        # CLEAN THIS SOMEHOW
        conn, curs = connect(DB_URL)
        curs.execute(query, (user,))
        verification = len(curs.fetchall())

        if verification > 0:
            query = """UPDATE userpools
                SET pool = %s
                WHERE username = %s"""
            
            curs.execute(query, (pool, user))

        else:
        
            query = """INSERT INTO userpools (username, pool)
                VALUES (%s, %s)"""

            curs.execute(query, (user, pool))

        close(conn, curs)

        return {"message": f"Successfully stored {user}'s pool."}
    
    else:
        return {"message": f"Failed to store {user}'s pool."}

    

def translate_names(pool: list) -> str:

    pool = tuple(pool) if len(pool) > 1 else "('" + pool[0] + "')"
    query = f"SELECT externalname FROM heroes WHERE internalname IN {pool};"

    conn, curs = connect(DB_URL)
    curs.execute(query)
    results = [x[0] for x in curs.fetchall()]
    print("query: ", query)
    print("results: ", results)
    results = ", ".join(results)
    close(conn, curs)

    return results

def get_attributes(curs) -> list:
    query = "SELECT Attribute FROM attributes ORDER BY id;"
    curs.execute(query)
    return [x[0] for x in curs.fetchall()]


if __name__ == '__main__':
    app.run(port=5000)