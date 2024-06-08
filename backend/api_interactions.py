import implements_api

def get_planets(system_solar):
    return implements_api.fetch_name_planets(system_solar)

def get_stellar_systems():
    return implements_api.fetch_stellar_hosts()

def get_textures_planets_planet_id(planet_id):
    return implements_api.fetch_textures_planets(planet_id)

