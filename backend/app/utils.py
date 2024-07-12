"""
This module contains utility functions for the application. The functions are used to calculate the position of celestial objects, extract planet names from filenames, and fetch texture data for planets.
"""

import requests
import urllib.parse
import csv
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from math import cos, sin, radians
import random

import numpy as np


def calculate_position(orbital_parameters, theta):
    """
    Calculate the position coordinates (x, y, z) of a celestial object based on orbital parameters.

    Args:
        orbital_parameters (dict): Dictionary containing orbital parameters:
            - 'orbsmax' (float): Semi-major axis in astronomical units (AU).
        theta (float): Angle in radians.

    Returns:
        dict: Dictionary with calculated coordinates:
            - 'x' (int): X-coordinate.
            - 'y' (int): Y-coordinate.
            - 'z' (int): Z-coordinate.
    """
    random.seed(orbital_parameters["orbsmax"])

    scale = 20

    return {
        "x": random.randint(-1000*scale, 1000*scale),
        "y": random.randint(-1000*scale, 1000*scale),
        "z": random.randint(-1000*scale, 1000*scale),
    }


def extract_planet_name(filename):
    """
    Extract the planet name from a given filename.

    Args:
        filename (str): The filename from which to extract the planet name.

    Returns:
        str or None: Extracted planet name if found, None otherwise.
    """
    match = re.search(r"2k_(.+)\.jpg", filename)
    if match:
        return match.group(1)
    return None


class fetch_planets_error(Exception):
    """
    Custom exception raised when there is an error fetching planet data.
    """
    pass


def fetch_textures_planets(planet_id):
    """
    Fetches the texture URL for a specific planet.

    Args:
        planet_id (str): The ID or name of the planet.

    Returns:
        str: URL of the texture image if found.

    Raises:
        fetch_planets_error: If no data is found for the specified planet (HTTP status code 404 or 500).
    """
    if planet_id == "":
        raise fetch_planets_error("Error 404: No data found for the specified planet")
    
    url = "https://www.solarsystemscope.com/textures/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 500:
        raise fetch_planets_error("Error 500")
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        textures = soup.find_all("a", class_="btn-type-1-blue texture-download-button")
        
        for texture in textures:
            download_link = texture["href"]
            if "2k" in download_link:
                name_planet = extract_planet_name(download_link)
                if name_planet == planet_id:
                    full_download_link = urljoin(url, download_link)
                    image_response = requests.get(full_download_link)
                    
                    if image_response.status_code == 200:
                        return full_download_link
                    else:
                        raise fetch_planets_error("Error 404: No data found for the specified planet")

    raise fetch_planets_error("Error 404: No data found for the specified planet")



# defalut solar system
solar_system = {
    "name": "Sol",
    "num_planets": 8,
    "planets": [
        {
            "name": "Mercury",
            "distance": 0.39,
            "ra": "",
            "dec": "",
            "orbsmax": 0.3871,
            "orbeccen": 0.2056,
            "orbincl": 7.005,
            "orblper": 77.456,
            "orbtper": 88.0,
            "sy_dist": 0,
            "radius_jupiter": 0.0553,
            "radius_earth": 0.3829,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 0.24,
            "planet_mass": 0.0553,
            "planet_density": 5.427,
            "planet_eqt": 340.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": calculate_position(
                    {
                        "orbsmax": 0.3871,
                        "orbeccen": 0.2056,
                        "orbincl": 7.005
                    },
                    radians(0),
                ),  # theta = 0
            "textures": {
                "diffuse": "/static/solar_system/2k_mercury.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": ""
            },
            "radius": 0.3829
        },
        {
            "name": "Venus",
            "distance": 0.72,
            "ra": "",
            "dec": "",
            "orbsmax": 0.7233,
            "orbeccen": 0.0068,
            "orbincl": 3.394,
            "orblper": 131.532,
            "orbtper": 224.7,
            "sy_dist": 0,
            "radius_jupiter": 0.815,
            "radius_earth": 0.9499,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 0.62,
            "planet_mass": 0.815,
            "planet_density": 5.243,
            "planet_eqt": 737.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": {
                "orbsmax": 0.7233,
                "orbeccen": 0.0068,
                "orbincl": 0.05934119456780717
            },
            "textures": {
                "diffuse": "/static/solar_system/2k_venus_surface.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": ""
            },
            "radius": 0.9499
        },
        {
            "name": "Earth",
            "distance": 1.0,
            "ra": "",
            "dec": "",
            "orbsmax": 1.0,
            "orbeccen": 0.0167,
            "orbincl": 0.0,
            "orblper": 102.947,
            "orbtper": 365.25,
            "sy_dist": 0,
            "radius_jupiter": 1.0,
            "radius_earth": 1.0,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 1.0,
            "planet_mass": 1.0,
            "planet_density": 5.513,
            "planet_eqt": 288.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": calculate_position(
                    {
                        "orbsmax": 1.0,
                        "orbeccen": 0.0167,
                        "orbincl": 0.0
                    },
                    radians(0),
                ),  # theta = 0
            "textures": {
                "diffuse": "/static/solar_system/2k_earth_daymap.jpg",
                "normal": "",
                "specular": "",
                "emissive": "/static/solar_system/Solarsystemscope_texture_8k_earth_nightmap.jpg",
                "opacity": "",
                "ambient": ""
            },
            "radius": 1.0
        },
        {
            "name": "Mars",
            "distance": 1.52,
            "ra": "",
            "dec": "",
            "orbsmax": 1.5237,
            "orbeccen": 0.0934,
            "orbincl": 1.85,
            "orblper": 336.041,
            "orbtper": 687.0,
            "sy_dist": 0,
            "radius_jupiter": 0.1074,
            "radius_earth": 0.532,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 1.88,
            "planet_mass": 0.1074,
            "planet_density": 3.933,
            "planet_eqt": 210.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": calculate_position(
                    {
                        "orbsmax": 1.5237,
                        "orbeccen": 0.0934,
                        "orbincl": 1.85
                    },
                    radians(0),
                ),  # theta = 0
            "textures": {
                "diffuse": "/static/solar_system/2k_mars.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": ""
            },
            "radius": 0.532
        },
        {
            "name": "Jupiter",
            "distance": 5.2,
            "ra": "",
            "dec": "",
            "orbsmax": 5.2028,
            "orbeccen": 0.0484,
            "orbincl": 1.305,
            "orblper": 14.753,
            "orbtper": 4331.0,
            "sy_dist": 0,
            "radius_jupiter": 1.0,
            "radius_earth": 11.209,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 11.86,
            "planet_mass": 317.8,
            "planet_density": 1.33,
            "planet_eqt": 165.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": calculate_position(
                    {
                        "orbsmax": 5.2028,
                        "orbeccen": 0.0484,
                        "orbincl": 1.305
                    },
                    radians(0),
                ),  # theta = 0
            "textures": {
                "diffuse": "/static/solar_system/2k_jupiter.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": ""
            },
            "radius": 11.209
        },
        {
            "name": "Saturn",
            "distance": 9.58,
            "ra": "",
            "dec": "",
            "orbsmax": 9.5388,
            "orbeccen": 0.0542,
            "orbincl": 2.485,
            "orblper": 92.431,
            "orbtper": 10747.0,
            "sy_dist": 0,
            "radius_jupiter": 0.86,
            "radius_earth": 9.449,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 29.46,
            "planet_mass": 95.2,
            "planet_density": 0.687,
            "planet_eqt": 134.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": calculate_position(
                    {
                        "orbsmax": 9.5388,
                        "orbeccen": 0.0542,
                        "orbincl": 2.485
                    },
                    radians(0),
                ),  # theta = 0
            "textures": {
                "diffuse": "/static/solar_system/2k_saturn.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": ""
            },
            "radius": 9.449
        },
        {
            "name": "Uranus",
            "distance": 19.22,
            "ra": "",
            "dec": "",
            "orbsmax": 19.1914,
            "orbeccen": 0.0472,
            "orbincl": 0.772,
            "orblper": 170.964,
            "orbtper": 30589.0,
            "sy_dist": 0,
            "radius_jupiter": 0.36,
            "radius_earth": 4.007,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 84.01,
            "planet_mass": 14.6,
            "planet_density": 1.27,
            "planet_eqt": 76.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": calculate_position(
                    {
                        "orbsmax": 19.1914,
                        "orbeccen": 0.0472,
                        "orbincl": 0.772
                    },
                    radians(0),
                ),  # theta = 0
            "textures": {
                "diffuse": "/static/solar_system/2k_uranus.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": ""
            },
            "radius": 4.007
        },
        {
            "name": "Neptune",
            "distance": 30.05,
            "ra": "",
            "dec": "",
            "orbsmax": 30.0698,
            "orbeccen": 0.0086,
            "orbincl": 1.769,
            "orblper": 44.971,
            "orbtper": 59800.0,
            "sy_dist": 0,
            "radius_jupiter": 0.347,
            "radius_earth": 3.883,
            "discovery_year": "",
            "discovery_method": "",
            "discovery_reference": "",
            "discovery_telescope": "",
            "host_name": "Sun",
            "orbital_period": 164.8,
            "planet_mass": 17.2,
            "planet_density": 1.638,
            "planet_eqt": 72.0,
            "planet_tranmid": "",
            "stellar_lum": 1.0,
            "stellar_age": 4.6,
            "stellar_mass": 1.0,
            "coordinates": calculate_position(
                    {
                        "orbsmax": 30.0698,
                        "orbeccen": 0.0086,
                        "orbincl": 1.769
                    },
                    radians(0),
                ),  # theta = 0
            "textures": {
                "diffuse": "/static/solar_system/2k_neptune.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": ""
            },
            "radius": 3.883
        }
    ]
}
