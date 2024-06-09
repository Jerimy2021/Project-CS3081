import requests
import urllib.parse
import csv
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from math import cos, sin,radians


def extract_planet_name(filename):
    match = re.search(r'2k_(.+)\.jpg', filename)
    if match:
        return match.group(1)
    return None

class fetch_planets_error(Exception):
    pass

def fetch_name_planets(system_solar):
    if system_solar == '':
        raise fetch_planets_error("Error 404: No data found for the specified system solar")
    encoded_system_solar = urllib.parse.quote_plus(system_solar)
    api_url = f"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(pl_name),sy_dist,ra,dec+from+ps+where+pl_name+like+%27%25{encoded_system_solar}%25%27+order+by+pl_name+desc&format=csv"
    headers = {
        'User-Agent': 'App'
    }
    response = requests.get(api_url, headers=headers)

    response_data = list(csv.reader(response.text.splitlines()))

    if not response_data or len(response_data) == 1:  
        raise fetch_planets_error("Error 404: No data found for the specified system solar")

    planets = response_data[1:]

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

    return planets


def fetch_stellar_hosts():
    api_url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(sy_name)+from+stellarhosts&format=csv'
    headers = {
        'User-Agent': 'App'
    }
    response = requests.get(api_url, headers=headers)
    if response.status_code == 500:
        raise fetch_planets_error("Error 500")
    
    response_data = list(csv.reader(response.text.splitlines()))

    system_solar = response_data[1:]
    return system_solar


def fetch_textures_planets(planet_id):
    if planet_id == '':
        raise fetch_planets_error("Error 404: No data found for the specified planet")
    url = "https://www.solarsystemscope.com/textures/"
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 500:
        raise fetch_planets_error("Error 500")

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        textures = soup.find_all('a', class_='btn-type-1-blue texture-download-button')

        for texture in textures:
            download_link = texture['href']
            if '2k' in download_link:
                name_planet = extract_planet_name(download_link)
                if name_planet == planet_id:
                    full_download_link = urljoin(url, download_link)
                    image_response = requests.get(full_download_link)

                    if image_response.status_code == 200:
                        return full_download_link 
                    else:
                        raise fetch_planets_error("Error 404: No data found for the specified planet")

