"""
This module contains the API routes for the application. The routes are used to fetch information about planets and stellar systems from the Exoplanet Archive API.
"""

from flask import Blueprint, request, jsonify, abort
from .utils import fetch_textures_planets, fetch_planets_error, calculate_position
from .utils import solar_system

api_bp = Blueprint("api", __name__)

import requests
import urllib.parse
import csv
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from math import cos, sin, radians

quant_textures = 10


@api_bp.route("/stellar_systems/<stellar_system>/planets", methods=["GET"])
def get_planets(stellar_system):
    """
    Fetches information about planets within a specified stellar system.

    Args:
        stellar_system (str): The name of the stellar system.

    Returns:
        tuple: A tuple containing JSON response with planet data and HTTP status code.
               Returns an error message and HTTP status code 400 if no stellar_system is provided.
               Returns data for the solar system and HTTP status code 200 if 'sun' is specified as stellar_system.
               Returns an error message and HTTP status code 404 if no data is found for the specified stellar_system.
    
    Example:
        >>> get_planets("sun")
        (
            {
                "success": True,
                "errors": [],
                "data": {
                    "planets": [
                        {
                            "name": "Earth",
                            "distance": "1.000000",
                            "ra": "0.000000",
                            "dec": "0.000000",
                            "orbsmax": "1.000000",
                            "orbeccen": "0.016710",
                            "orbincl": "0.000000",
                            "orblper": "102.930058",
                            "orbtper": "2451545.000000",
                            "sy_dist": "0.000015",
                            "radius_jupiter": "1.000000",
                            "radius_earth": "1.000000",
                            "discovery_year": "0",
                            "discovery_method": "Transit",
                            "discovery_reference": "https://ui.adsabs.harvard.edu/abs/2018ApJ...860...68H/abstract",
                            "discovery_telescope": "Kepler",
                            "host_name": "Sun",
                            "orbital_period": "365.256363",
                            "planet_mass": "0.003147",
                            "planet_density": "5.513603",
                            "planet_eqt": "254.000000",
                            "planet_tranmid": "2451545.000000",
                            "stellar_lum": "1.000000",
                            "stellar_age": "4600000000.000000",
                            "stellar_mass": "1.000000",
                            "coordinates": {
                                "x": 1.000000,
                                "y": 0.000000,
                                "z": 0.000000
                            },
                            "textures": {
                                "diffuse": "/static/planet_textures/planet_bk1.png",
                                "normal": "",
                                "specular": "",
                                "emissive": "",
                                "opacity": "",
                                "ambient": ""
                            },
                            "radius": "1.000000"
                        }
                    ]
                }
            },
            200
        )
    """
    try:
        if stellar_system == "":
            return (
                jsonify(
                    {
                        "success": False,
                        "errors": ["Error 400: No stellar_system provided"],
                    }
                ),
                400,
            )
        elif stellar_system.lower() == "sun" or stellar_system.lower() == "earth":
            return (
                jsonify(
                    {
                        "success": True,
                        "errors": [],
                        "data": solar_system,
                    }
                ),
                200,
            )

        encoded_stellar_system = urllib.parse.quote_plus(stellar_system)

        api_url = f"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(pl_name),sy_dist,ra,dec,pl_orbsmax,pl_orbeccen,pl_orbincl,pl_orblper,pl_orbtper,sy_dist,pl_radj,pl_rade,disc_year,discoverymethod,disc_refname,disc_telescope,hostname,pl_orbper,pl_bmassj,pl_dens,pl_eqt,pl_tranmid,st_lum,st_age,st_mass+from+pscomppars+where+pl_name+like+%27%25{encoded_stellar_system}%25%27+order+by+pl_name+desc&format=csv"
        headers = {"User-Agent": "App"}

        response = requests.get(api_url, headers=headers)

        response_data = list(csv.reader(response.text.splitlines()))

        if not response_data:
            return (
                jsonify(
                    {
                        "success": False,
                        "errors": [
                            "Error 404: No data found for the specified stellar_system"
                        ],
                    }
                ),
                404,
            )

        print(response_data)
        if len(response_data) == 1:
            return (
                jsonify(
                    {
                        "success": False,
                        "errors": [
                            "Error 404: No data found for the specified stellar_system"
                        ],
                    }
                ),
                404,
            )

        # veremos si mua puede hacer un cambio

        planets = response_data[1:]

        def sumchars(s):
            return sum(ord(c) for c in s)

        def a_tag_get_link(string):
            match = ""
            prev = ""
            for i in range(len(string)):
                prev += string[i]
                if len(prev) >= 5:
                    if prev[-5:] == "href=":
                        match = string[i + 1 :]
                        break

            match = match.split(" ")[0]

            return match if match else string

        planets = [
            {
                "name": planet[0],
                "distance": planet[1],
                "ra": planet[2],
                "dec": planet[3],
                "orbsmax": planet[4],
                "orbeccen": planet[5],
                "orbincl": planet[6],
                "orblper": planet[7],
                "orbtper": planet[8],
                "sy_dist": planet[
                    9
                ],  # Distance to the planetary system in units of parsecs
                "radius_jupiter": planet[10],
                "radius_earth": planet[11],
                "discovery_year": planet[12],
                "discovery_method": planet[13],
                "discovery_reference": a_tag_get_link(planet[14]),
                "discovery_telescope": planet[15],
                "host_name": planet[16],
                "orbital_period": planet[17],
                "planet_mass": planet[18],
                "planet_density": planet[19],
                "planet_eqt": planet[20],
                "planet_tranmid": planet[21],
                "stellar_lum": planet[22],
                "stellar_age": planet[23],
                "stellar_mass": planet[24],
                "coordinates": calculate_position(
                    {
                        "orbsmax": (
                            float(planet[4]) if planet[4] else 0
                        ),  # Semi-eje mayor en AU (AU es la unidad de distancia entre la Tierra y el Sol)
                        "orbeccen: ": (
                            float(planet[5]) if planet[5] else 0
                        ),  # Excentricidad (es un número entre 0 y 1, si es 0 es una órbita circular y si es 1 es una órbita parabólica)
                        "orbincl": (
                            float(planet[6]) if planet[6] else 0
                        ),  # Inclinación en grados convertido a radianes (es el ángulo entre el plano de la órbita y el plano del ecuador de la estrella)
                    },
                    radians(0),
                ),  # theta = 0
                "textures": {
                    "diffuse": "/static/planet_textures/planet_bk"
                    + str(sumchars(planet[0]) % quant_textures + 1)
                    + ".png",
                    "normal": "",
                    "specular": "",
                    "emissive": "",
                    "opacity": "",
                    "ambient": "",
                },
                "radius": planet[11],
            }
            for planet in planets
        ]

        return (
            jsonify({"success": True, "errors": [], "data": {"planets": planets}}),
            200,
        )

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@api_bp.route("/stellar_systems", methods=["GET"])
def stellar_systems():
    """
    Fetches information about stellar systems and the number of planets they host.

    Returns:
        tuple: A tuple containing JSON response with stellar system data and HTTP status code.
               Returns an error message and HTTP status code 404 if no data is found.
    
    Example:
        >>> stellar_systems()
        (
            {
                "success": True,
                "errors": [],
                "data": {
                    "stellar_systems": [
                        {
                            "name": "Sun",
                            "num_planets": 8
                        },
                        {
                            "name": "Kepler-90",
                            "num_planets": 8
                        },
                        ...
                    ]
                }
            },
            200
        )
    """
    try:
        api_url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(sy_name),sy_pnum+from+stellarhosts+order+by+sy_pnum+desc&format=csv"
        headers = {"User-Agent": "App"}

        response = requests.get(api_url, headers=headers)
        if response.status_code == 500:
            abort(500)

        response_data = list(csv.reader(response.text.splitlines()))

        if len(response_data) == 1:
            return (
                jsonify(
                    {
                        "success": False,
                        "errors": [
                            "Error 404: No data found for the specified stellar_system"
                        ],
                    }
                ),
                404,
            )

        # en la primera columna están los nombres

        def sumchars(s):
            return sum(ord(c) for c in s)
        
        def getTextures(name):
            if name == "Sun":
                return "/static/star_textures/8k_sun.jpg"
            return "/static/planet_textures/planet_bk" + str(sumchars(name) % quant_textures + 1) + ".png"

        stellar_systems = response_data[1:]
        stellar_systems = [
            {
                "name": stellar_system[0], 
                "num_planets": int(stellar_system[1]),
                "textures": {
                    "diffuse": getTextures(stellar_system[0]),
                    "normal": "",
                    "specular": "",
                    "emissive": getTextures(stellar_system[0]),
                    "opacity": "",
                    "ambient": "",
                    },
                "coordinates": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "radius": 1000.0,
            }
            for stellar_system in stellar_systems
        ]

        # ordenar por número de planetas de mayor a menor
        stellar_systems = sorted(
            stellar_systems, key=lambda x: x["num_planets"], reverse=True
        )

        # insertar el sol

        stellar_systems.insert(0, {
            "name": "Sun",
            "num_planets": 8,
            "textures": {
                "diffuse": getTextures("Sun"),
                "normal": "",
                "specular": "",
                "emissive": getTextures("Sun"),
                "opacity": "",
                "ambient": "",
            },
            "coordinates": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "radius": 1000.0,
        })

        return (
            jsonify(
                {
                    "success": True,
                    "errors": [],
                    "data": {"stellar_systems": stellar_systems},
                }
            ),
            200,
        )

    except Exception as e:
        abort(500)


@api_bp.route("/textures/<planet_id>", methods=["GET"])
def textures(planet_id):
    """
    Fetches textures for a specific planet.

    Args:
        planet_id (str): The ID or name of the planet.

    Returns:
        tuple: A tuple containing JSON response with texture URL and HTTP status code.
               Returns an error message and HTTP status code 404 if the textures are not found.
        
    Example:
        >>> textures("earth")
        (
            {
                "texture_url": "/static/planet_textures/planet_bk1.png"
            },
            200
        )
    """
    try:
        textures_data = fetch_textures_planets(planet_id)
        return jsonify({"texture_url": textures_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 404
