import api_interactions


def test_can_call_get_planets_11Com():
    sistema_solar = '11 Com'
    detect = api_interactions.get_planets(sistema_solar)
    expected = '11 Com'
    assert detect[0][0][:6] == expected

def test_can_call_get_planets_47_UMa():
    sistema_solar = '47 UMa'
    detect = api_interactions.get_planets(sistema_solar)
    expected = '47 UMa'
    assert detect[0][0][:6] == expected

def test_can_call_get_planets_55_Cnc():
    sistema_solar = '55 Cnc'
    detect = api_interactions.get_planets(sistema_solar)
    expected = '55 Cnc'
    assert detect[0][0][:6] == expected


def test_can_call_get_stellar_systems_all_planets():
    try:
        data = api_interactions.get_stellar_systems()
        assert isinstance(data, list)
        assert len(data) > 0
    except api_interactions.exoplanet_api.fetch_planets_error as e:
        assert False, f"Error: {e}"

def test_can_call_get_planets_error_unknow_planet():
    sistema_solar = 'asdasd adsf'
    try:
        api_interactions.get_planets(sistema_solar)
        assert False, "Error not raised"
    except api_interactions.implements_api.fetch_planets_error as e:
        assert str(e) == "Error 404: No data found for the specified system solar"

def test_can_call_get_planets_error_any_planet():
    sistema_solar = ''
    try:
        api_interactions.get_planets(sistema_solar)
        assert False, "Error not raised"
    except api_interactions.implements_api.fetch_planets_error  as e:
        assert str(e) == "Error 404: No data found for the specified system solar"


def test_can_call_get_stellar_systems_error_500():
    try:
        api_interactions.get_stellar_systems()
    except Exception as e:
        assert str(e) == "Error 500"


def test_the_result_get_planets_points_x_y_z_11_Com():
    sistema_solar = '11 Com'
    detect = api_interactions.get_planets(sistema_solar)
    expected = [-88.36495785761475,28.475644468901386,-8.00884336609817]
    assert detect[0][1] == expected[0]
    assert detect[0][2] == expected[1]
    assert detect[0][3] == expected[2]

def test_the_result_get_planets_points_x_y_z_47_UMa():
    sistema_solar = '47 UMa'
    detect = api_interactions.get_planets(sistema_solar)
    expected = [[-10.137665731731706, 8.94750629886708, 2.742042201244645], [-10.137665731731706, 8.94750629886708, 2.742042201244645], [-10.137665731731706, 8.94750629886708, 2.742042201244645]] 
    for i in range(len(detect)):
        for j in range(1,len(detect[i])):
            assert detect[i][j] == expected[i-1][j-1]

def test_the_result_get_planets_points_x_y_z_14_Her():
    sistema_solar = '14 Her'
    detect = api_interactions.get_planets(sistema_solar)
    expected = [-5.954230683777855, 12.415414644607335, -11.487906661216746]
    for i in range(1,len(detect)):
        assert detect[i] == expected[i-1]

def test_the_result_get_textures_planets_mercury():
    detect = api_interactions.get_textures_planets_planet_id('mercury')
    expected = 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg'
    assert detect == expected


def test_the_result_get_textures_planets_saturn():
    detect = api_interactions.get_textures_planets_planet_id('saturn')
    expected = 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg'
    assert detect == expected

def test_the_result_get_textures_planets_moon():
    detect = api_interactions.get_textures_planets_planet_id('moon')
    expected = 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg'
    assert detect == expected

def test_the_result_get_textures_planets_stars():
    detect = api_interactions.get_textures_planets_planet_id('stars')
    expected = 'https://www.solarsystemscope.com/textures/download/2k_stars.jpg'
    assert detect == expected

def test_the_result_get_textures_planets_jupiter():
    detect = api_interactions.get_textures_planets_planet_id('jupiter')
    expected = 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg'
    assert detect == expected


