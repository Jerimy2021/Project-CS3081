import api

def test_can_call_GeT_Planets():
    sistema_solar = '11 Com'
    detect = api.GetPlanets(sistema_solar)
    expected = [['11 Com b']]
    assert detect == expected

def test_can_call_GetStellarSystems():
    try:
        data = api.GetStellarSystems()
        assert isinstance(data, list)
        assert len(data) > 0
    except api.implements_api.FetchPlanetsError as e:
        assert False, f"Error: {e}"

def test_can_call_GeT_Planets_error():
    sistema_solar = 'asdasd adsf'
    try:
        api.GetPlanets(sistema_solar)
        assert False, "Error not raised"
    except api.implements_api.FetchPlanetsError as e:
        assert str(e) == "Error 404: No data found for the specified system solar"


def test_can_call_GetStellarSystems_error():
    try:
        api.GetStellarSystems()
    except Exception as e:
        assert str(e) == "Error 500"
