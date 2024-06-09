from flask import Blueprint, request, jsonify, abort
from .utils import fetch_textures_planets, fetch_planets_error

api_bp = Blueprint('api', __name__)

import requests
import urllib.parse
import csv
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from math import cos, sin, radians

@api_bp.route('/planets/<stellar_system>', methods=['GET'])
def get_planets(stellar_system):
    try:
        if stellar_system == '':
            return jsonify({
                'success': False,
                'errors': ["Error 400: No stellar_system provided"]
            }), 400
        
        encoded_stellar_system = urllib.parse.quote_plus(stellar_system)

        api_url = f"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(pl_name),sy_dist,ra,dec+from+ps+where+pl_name+like+%27%25{encoded_stellar_system}%25%27+order+by+pl_name+desc&format=csv"
        headers = {
            'User-Agent': 'App'
        }
        response = requests.get(api_url, headers=headers)

        response_data = list(csv.reader(response.text.splitlines()))

        if not response_data:  
            print(1)
            return jsonify({
                'success': False,
                'errors': ["Error 404: No data found for the specified stellar_system"]
            }), 404
        
        print(response_data)
        if len(response_data) == 1:
            print(2)
            return jsonify({
                'success': False,
                'errors': ["Error 404: No data found for the specified stellar_system"]
            }), 404

        planets = response_data[1:]
        print(planets)

        for planet in planets:
            distance = float(planet[1])
            ra = float(planet[2])
            dec = float(planet[3])
            ra_radians = radians(ra)
            dec_radians = radians(dec)
            x = distance * cos(dec_radians) * cos(ra_radians)
            y = distance * sin(dec_radians)
            z = distance * cos(dec_radians) * sin(ra_radians)
            planet[1] = x
            planet[2] = y
            planet[3] = z

        return jsonify({
            'success': True,
            'errors': [],
            'data': {
                'planets': planets
            }
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@api_bp.route('/stellar_systems', methods=['GET'])
def stellar_systems():
    try:
        api_url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(sy_name)+from+stellarhosts&format=csv'
        headers = {
            'User-Agent': 'App'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code == 500:
            abort(500)
        
        response_data = list(csv.reader(response.text.splitlines()))

        system_solar = response_data[1:]

        return jsonify({
            'success': True,
            'errors': [],
            'data': {
                'stellar_systems': system_solar
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
