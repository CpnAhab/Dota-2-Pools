import os
from flask import Flask, flash, render_template, request, session, redirect, send_file, send_from_directory
from flask_restful import Api, Resource, reqparse
from api.ApiHandler import ApiHandler
#from flask_cors import CORS
import random
import psycopg2

# UNCOMMENT FOR HOSTING
DB_URL = os.environ['DATABASE_URL']

def connect(url: str):
    conn = psycopg2.connect(url, sslmode="require")
    curs = conn.cursor()
    return conn, curs

def close(conn, curs):
    conn.commit()
    conn.close()
    curs.close()


str = [
    'abaddon', 'alchemist', 'axe', 'beastmaster', 'brewmaster', 'bristleback', 'centaur', 'chaos_knight', 'rattletrap', 'dawnbreaker', 'doom_bringer', 'dragon_knight', 'earth_spirit', 'earthshaker',
    'elder_titan', 'huskar', 'wisp', 'kunkka', 'legion_commander', 'life_stealer', 'lycan', 'magnataur', 'marci', 'mars', 'night_stalker', 'omniknight', 'phoenix',
    'pudge', 'sand_king', 'slardar', 'snapfire', 'spirit_breaker', 'sven', 'tidehunter', 'shredder', 'tiny', 'treant', 'tusk', 'abyssal_underlord', 'undying', 'skeleton_king']

agi = [
    'antimage', 'arc_warden', 'bloodseeker', 'bounty_hunter', 'broodmother', 'clinkz', 'drow_ranger', 'ember_spirit', 'faceless_void', 'gyrocopter', 'hoodwink', 
    'juggernaut', 'lone_druid', 'luna', 'medusa', 'meepo', 'mirana', 'monkey_king', 'morphling', 'naga_siren', 'nyx_assassin', 'pangolier', 'phantom_assassin', 'phantom_lancer',
    'razor', 'riki', 'nevermore', 'slark', 'sniper', 'spectre', 'templar_assassin', 'terrorblade', 'troll_warlord', 'ursa', 'vengefulspirit', 'venomancer', 'viper', 'weaver']

int = [
    'ancient_apparition', 'bane', 'batrider', 'chen', 'crystal_maiden', 'dark_seer', 'dark_willow', 'dazzle', 'death_prophet', 'disruptor', 'enchantress', 'enigma', 'grimstroke', 'invoker',
    'jakiro', 'keeper_of_the_light', 'leshrac', 'lich', 'lina', 'lion', 'furion', 'necrolyte', 'ogre_magi', 'oracle', 'obsidian_destroyer', 'puck', 'pugna', 'queenofpain', 'rubick',
    'shadow_demon', 'shadow_shaman', 'silencer', 'skywrath_mage', 'storm_spirit', 'techies', 'tinker', 'visage', 'void_spirit', 'warlock', 'windrunner', 'winter_wyvern', 'witch_doctor', 'zuus']

app = Flask(__name__, static_url_path = '', static_folder = "ui/build")
#CORS(app)
api = Api(app)

@app.route("/", defaults={'path':''})
def index(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/request", methods=["POST"])
def as_text():

    pool = compile_heroes()

    if request.form["op"] == "random":
        if not pool:
            hero = "No heroes to choose from."
        else:
            rand_hero = [random.choice(pool)]
            hero = f"{translate_names(rand_hero)} chosen from {len(pool)} heroes."
        
        return render_template("index.html", hero=hero)

    elif request.form["op"] == "to_text":
        if not pool:
            pool = "No heroes selected."
        else:
            pool = translate_names(pool)

        return render_template("index.html", pool=pool)

    elif request.form["op"] == "download":

        path = "hero_pool.txt"
        if not pool:
            message = "No heroes selected."
            return render_template("index.html", message=message)

        else:
            with open(path, 'w') as f:
                f.write(translate_names(pool))
            return send_file(path, as_attachment=True)

    elif request.form["op"] == "to_sb":
        return redirect("/")

def compile_heroes():
    
    pool = list()
    for hero in str:
        if request.form.get(hero):
            pool.append(hero)
    for hero in agi:
        if request.form.get(hero):
            pool.append(hero)
    for hero in int:
        if request.form.get(hero):
            pool.append(hero)
    
    return pool

def translate_names(pool: list) -> str:

    # pool = "('" + "', '".join(pool) + "')"
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

api.add_resource(ApiHandler, '/flask/hello')



if __name__ == '__main__':
    app.run(port=5000)