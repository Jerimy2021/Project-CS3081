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

    # Calcula las coordenadas x, y, z de un planeta en relación con su estrella anfitriona.

    # Parameters:
    # orbital_parameters (dict): Parámetros orbitales del planeta.
    # theta (float): Ángulo de la anomalía verdadera en radianes.

    # Returns:
    # tuple: Coordenadas x, y, z.

    # actualizar seed del random con orbital
    random.seed(orbital_parameters["orbsmax"])

    return {
        "x": random.randint(-1000, 1000),
        "y": random.randint(-1000, 1000),
        "z": random.randint(-1000, 1000),
    }


def extract_planet_name(filename):
    match = re.search(r"2k_(.+)\.jpg", filename)
    if match:
        return match.group(1)
    return None


class fetch_planets_error(Exception):
    pass


def fetch_textures_planets(planet_id):
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
                        raise fetch_planets_error(
                            "Error 404: No data found for the specified planet"
                        )


# defalut solar system

solar_system = {
    "name": "Sol",
    "num_planets": 8,
    "planets": [
        {
            "name": "Mercurio",
            "distance": 0.39,
            "ra": 0,
            "dec": 0,
            "orbsmax": 0.39,
            "orbeccen": 0.2056,
            "orbincl": 7,
            "orblper": 77.45645,
            "orbtper": 88,
            "sy_dist": 0.39,
            "radius_jupiter": 0.382,
            "radius_earth": 0.383,
            "coordinates": calculate_position(
                {"orbsmax": 0.39, "orbeccen": 0.2056, "orbincl": 7}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_mercury.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 0.383,
        },
        {
            "name": "Venus",
            "distance": 0.72,
            "ra": 0,
            "dec": 0,
            "orbsmax": 0.72,
            "orbeccen": 0.0068,
            "orbincl": 3.39,
            "orblper": 131.53298,
            "orbtper": 224.7,
            "sy_dist": 0.72,
            "radius_jupiter": 0.949,
            "radius_earth": 0.949,
            "coordinates": calculate_position(
                {"orbsmax": 0.72, "orbeccen": 0.0068, "orbincl": 3.39}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_venus_surface.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 0.949,
        },
        {
            "name": "Tierra",
            "distance": 1,
            "ra": 0,
            "dec": 0,
            "orbsmax": 1,
            "orbeccen": 0.0167,
            "orbincl": 0,
            "orblper": 102.94719,
            "orbtper": 365.2,
            "sy_dist": 1,
            "radius_jupiter": 1,
            "radius_earth": 1,
            "coordinates": calculate_position(
                {"orbsmax": 1, "orbeccen": 0.0167, "orbincl": 0}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_earth_daymap.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 1,
        },
        {
            "name": "Marte",
            "distance": 1.52,
            "ra": 0,
            "dec": 0,
            "orbsmax": 1.52,
            "orbeccen": 0.0934,
            "orbincl": 1.85,
            "orblper": 336.04084,
            "orbtper": 687,
            "sy_dist": 1.52,
            "radius_jupiter": 0.532,
            "radius_earth": 0.532,
            "coordinates": calculate_position(
                {"orbsmax": 1.52, "orbeccen": 0.0934, "orbincl": 1.85}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_mars.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 0.532,
        },
        {
            "name": "Júpiter",
            "distance": 5.2,
            "ra": 0,
            "dec": 0,
            "orbsmax": 5.2,
            "orbeccen": 0.0489,
            "orbincl": 1.3,
            "orblper": 14.75385,
            "orbtper": 4331,
            "sy_dist": 5.2,
            "radius_jupiter": 11.209,
            "radius_earth": 11.209,
            "coordinates": calculate_position(
                {"orbsmax": 5.2, "orbeccen": 0.0489, "orbincl": 1.3}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_jupiter.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 11.209,
        },
        {
            "name": "Saturno",
            "distance": 9.58,
            "ra": 0,
            "dec": 0,
            "orbsmax": 9.58,
            "orbeccen": 0.0565,
            "orbincl": 2.49,
            "orblper": 92.43194,
            "orbtper": 10747,
            "sy_dist": 9.58,
            "radius_jupiter": 9.449,
            "radius_earth": 9.449,
            "coordinates": calculate_position(
                {"orbsmax": 9.58, "orbeccen": 0.0565, "orbincl": 2.49}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_saturn.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 9.449,
        },
        {
            "name": "Urano",
            "distance": 19.22,
            "ra": 0,
            "dec": 0,
            "orbsmax": 19.22,
            "orbeccen": 0.0463,
            "orbincl": 0.77,
            "orblper": 170.96424,
            "orbtper": 30660,
            "sy_dist": 19.22,
            "radius_jupiter": 4.007,
            "radius_earth": 4.007,
            "coordinates": calculate_position(
                {"orbsmax": 19.22, "orbeccen": 0.0463, "orbincl": 0.77}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_uranus.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 4.007,
        },
        {
            "name": "Neptuno",
            "distance": 30.05,
            "ra": 0,
            "dec": 0,
            "orbsmax": 30.05,
            "orbeccen": 0.0097,
            "orbincl": 1.77,
            "orblper": 44.97135,
            "orbtper": 60152,
            "sy_dist": 30.05,
            "radius_jupiter": 3.883,
            "radius_earth": 3.883,
            "coordinates": calculate_position(
                {"orbsmax": 30.05, "orbeccen": 0.0097, "orbincl": 1.77}, radians(0)
            ),
            "textures": {
                "diffuse": "/static/solar_system/2k_neptune.jpg",
                "normal": "",
                "specular": "",
                "emissive": "",
                "opacity": "",
                "ambient": "",
            },
            "radius": 3.883,
        },
    ],
}
