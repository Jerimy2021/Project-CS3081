from flask import Blueprint, request, jsonify, abort
from .utils import fetch_textures_planets, fetch_planets_error, calculate_position

api_bp = Blueprint('api', __name__)

import requests
import urllib.parse
import csv
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from math import cos, sin, radians


@api_bp.route('/stellar_systems/<stellar_system>/planets', methods=['GET'])
def get_planets(stellar_system):
    try:
        if stellar_system == '':
            return jsonify({
                'success': False,
                'errors': ["Error 400: No stellar_system provided"]
            }), 400
        
        encoded_stellar_system = urllib.parse.quote_plus(stellar_system)

        api_url = f"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(pl_name),sy_dist,ra,dec,pl_orbsmax,pl_orbeccen,pl_orbincl,pl_orblper,pl_orbtper,sy_dist,pl_radj,pl_rade+from+pscomppars+where+pl_name+like+%27%25{encoded_stellar_system}%25%27+order+by+pl_name+desc&format=csv"
        headers = {
            'User-Agent': 'App'
        }
        response = requests.get(api_url, headers=headers)

        response_data = list(csv.reader(response.text.splitlines()))

        if not response_data:  
            return jsonify({
                'success': False,
                'errors': ["Error 404: No data found for the specified stellar_system"]
            }), 404
        
        print(response_data)
        if len(response_data) == 1:
            return jsonify({
                'success': False,
                'errors': ["Error 404: No data found for the specified stellar_system"]
            }), 404

        planets = response_data[1:]
        planets = [
            {
                'name': planet[0],
                'distance': planet[1],
                'ra': planet[2],
                'dec': planet[3],
                'orbsmax': planet[4],
                'orbeccen': planet[5],
                'orbincl': planet[6],
                'orblper': planet[7],
                'orbtper': planet[8],
                'sy_dist': planet[9], #Distance to the planetary system in units of parsecs
                'radius_jupiter': planet[10],
                'radius_earth': planet[11],
                'position': calculate_position({
                    'orbsmax': float(planet[4]) if planet[4] else 0, #Semi-eje mayor en AU
                    'orbeccen: ': float(planet[5]) if planet[5] else 0, #Excentricidad
                    'orbincl': float(planet[6]) if planet[6] else 0 #Inclinación en grados convertido a radianes
                }, radians(0)) #theta = 0
            }
            for planet in planets
        ]
    

        return jsonify({
            'success': True,
            'errors': [],
            'data': {
                'planets': planets
            }
        }), 200
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@api_bp.route('/stellar_systems', methods=['GET'])
def stellar_systems():
    try:
        api_url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(sy_name),sy_pnum,st_rad,st_vsin+from+stellarhosts+order+by+sy_pnum+desc&format=csv'
        headers = {
            'User-Agent': 'App'
        }

        response = requests.get(api_url, headers=headers)
        if response.status_code == 500:
            abort(500)
        
        response_data = list(csv.reader(response.text.splitlines()))

        if len(response_data) == 1:
            return jsonify({
                'success': False,
                'errors': ["Error 404: No data found for the specified stellar_system"]
            }), 404
        
        # en la primera columna están los nombres

        stellar_systems = response_data[1:]
        stellar_systems = [
            {
                'name': stellar_system[0],
                'num_planets': int(stellar_system[1]),
                'radius': stellar_system[2],
                'velocity': stellar_system[3]
            }
            for stellar_system in stellar_systems
        ]

        #ordenar por número de planetas de mayor a menor
        stellar_systems = sorted(stellar_systems, key=lambda x: x['num_planets'], reverse=True)
        return jsonify({
            'success': True,
            'errors': [],
            'data': {
                'stellar_systems': stellar_systems
            }
        }), 200
    
    except Exception as e:
        abort(500)

@api_bp.route('/textures/<planet_id>', methods=['GET'])
def textures(planet_id):
    try:
        textures_data = fetch_textures_planets(planet_id)
        return jsonify({"texture_url": textures_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 404
