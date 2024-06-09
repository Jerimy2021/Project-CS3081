import requests
import urllib.parse
import csv
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from math import cos, sin, radians

def extract_planet_name(filename):
    match = re.search(r'2k_(.+)\.jpg', filename)
    if match:
        return match.group(1)
    return None

class fetch_planets_error(Exception):
    pass

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
