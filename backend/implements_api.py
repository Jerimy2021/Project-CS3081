import requests
import urllib.parse
import csv

class FetchPlanetsError(Exception):
    pass

def fetch_name_planets(system_solar):
    encoded_system_solar = urllib.parse.quote_plus(system_solar)
    api_url = f"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(pl_name)+from+ps+where+pl_name+like+%27%25{encoded_system_solar}%25%27+order+by+pl_name+desc&format=csv"
    headers = {
        'User-Agent': 'App'
    }
    response = requests.get(api_url, headers=headers)

    response_data = list(csv.reader(response.text.splitlines()))

    if not response_data or len(response_data) == 1:  
        raise FetchPlanetsError("Error 404: No data found for the specified system solar")
    
    return response_data[1:]


def fetch_stellar_hosts():
    api_url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+distinct(sy_name)+from+stellarhosts&format=csv'
    headers = {
        'User-Agent': 'App'
    }
    response = requests.get(api_url, headers=headers)
    if response.status_code == 500:
        raise FetchPlanetsError("Error 500")
    
    response_data = list(csv.reader(response.text.splitlines()))
    
    return response_data[1:]
