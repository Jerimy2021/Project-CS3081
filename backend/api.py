import implements_api

def GetPlanets(SystemSolar):
    return implements_api.fetch_name_planets(SystemSolar)

def GetStellarSystems():
    return implements_api.fetch_stellar_hosts()
