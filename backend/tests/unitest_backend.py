"""
This file contains the unit tests for the backend of the application.
The tests are run using the unittest module.
"""

import unittest
from unittest.mock import patch, MagicMock
import sys
sys.path.append('..')
from flask import current_app
from flask_testing import TestCase
from app import create_app

# para correr los tests:
# python -m unittest tests.unitest_backend

class TestRoutes(TestCase):

    def create_app(self):
        app = create_app()
        app.config['TESTING'] = True
        return app

    @patch('app.routes.requests.get')
    def test_get_planets_success_200(self, mock_get):
        """
        Test the get_planets route with a successful response.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = (
            "pl_name,sy_dist,ra,dec,pl_orbsmax,pl_orbeccen,pl_orbincl,pl_orblper,pl_orbtper,sy_dist,pl_radj,pl_rade\n"
            "PlanetX,10,123,45,1,0.5,10,20,30,40,1,1\n"
        )
        mock_get.return_value = mock_response

        response = self.client.get('/stellar_systems/sun/planets')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertTrue(data['success'])
        self.assertIn('data', data)

    @patch('app.routes.requests.get')
    def test_get_planets_failure_404(self, mock_get):
        """
        Test the get_planets route with a 404 response.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = "pl_name,sy_dist,ra,dec,pl_orbsmax,pl_orbeccen,pl_orbincl,pl_orblper,pl_orbtper,sy_dist,pl_radj,pl_rade\n"
        mock_get.return_value = mock_response

        response = self.client.get('/stellar_systems/krypton/planets')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertFalse(data['success'])
        self.assertIn('errors', data)
        self.assertIn('Error 404', data['errors'][0])

    @patch('app.routes.requests.get')
    def test_get_stellar_systems_success(self, mock_get):
        """
        Test the get_stellar_systems route with a successful response.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = (
            "sy_name,sy_pnum\n"
            "SystemX,5\n"
            "SystemY,10\n"
        )
        mock_get.return_value = mock_response

        response = self.client.get('/stellar_systems')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertTrue(data['success'])
        self.assertIn('data', data)
        self.assertIn('stellar_systems', data['data'])

    @patch('app.routes.fetch_textures_planets')
    def test_get_textures_success(self, mock_fetch_textures):
        """
        Test the get_textures route with a successful response.
        """
        mock_fetch_textures.return_value = "some_texture_url"
        
        response = self.client.get('/textures/earth')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertIn('texture_url', data)
        self.assertEqual(data['texture_url'], "some_texture_url")

    @patch('app.routes.requests.get')
    def test_get_planets_with_special_characters(self, mock_get):
        """
        Test the get_planets route with a successful response.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = (
            "pl_name,sy_dist,ra,dec,pl_orbsmax,pl_orbeccen,pl_orbincl,pl_orblper,pl_orbtper,sy_dist,pl_radj,pl_rade\n"
            "Planet-1,20,123,45,1,0.5,10,20,30,40,1,1\n"
        )
        mock_get.return_value = mock_response

        response = self.client.get('/stellar_systems/special%20system/planets')
        self.assertEqual(response.status_code, 200)
        data = response.json
        self.assertTrue(data['success'])
        self.assertIn('data', data)

    @patch('app.routes.requests.get')
    def test_get_planets_empty_response(self, mock_get):
        """
        Test the get_planets route with an empty response.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = "pl_name,sy_dist,ra,dec,pl_orbsmax,pl_orbeccen,pl_orbincl,pl_orblper,pl_orbtper,sy_dist,pl_radj,pl_rade\n"
        mock_get.return_value = mock_response

        response = self.client.get('/stellar_systems/empty/planets')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertFalse(data['success'])
        self.assertIn('errors', data)
        self.assertIn('Error 404', data['errors'][0])

    @patch('app.routes.requests.get')
    def test_get_stellar_systems_empty(self, mock_get):
        """
        Test the get_stellar_systems route with an empty response.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = "sy_name,sy_pnum\n"
        mock_get.return_value = mock_response

        response = self.client.get('/stellar_systems')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertFalse(data['success'])
        self.assertIn('errors', data)
        self.assertIn('Error 404', data['errors'][0])

    @patch('app.routes.fetch_textures_planets')
    def test_get_textures_invalid_planet(self, mock_fetch_textures):
        """
        Test the get_textures route with an invalid planet.
        """
        mock_fetch_textures.side_effect = Exception("Planet not found")
        
        response = self.client.get('/textures/invalid_planet')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertIn('error', data)
        self.assertEqual(data['error'], "Planet not found")

    def test_get_planets_no_stellar_system(self):
        """
        Test the get_planets route with no stellar system.
        """
        response = self.client.get('/stellar_systems//planets')
        self.assertEqual(response.status_code, 404)

    def test_get_planets_with_null(self):
        """
        Test the get_planets route with null stellar system.
        """
        response = self.client.get('/stellar_systems/null/planets')
        self.assertEqual(response.status_code, 404)

    @patch('app.routes.requests.get')
    def test_get_stellar_systems_failure_500(self, mock_get):
        """
        Test the get_stellar_systems route with a 500 response.
        """
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_get.return_value = mock_response

        response = self.client.get('/stellar_systems')
        self.assertEqual(response.status_code, 500)


    @patch('app.routes.fetch_textures_planets')
    def test_get_textures_failure_500(self, mock_fetch_textures):
        """
        Test the get_textures route with a 500 response
        """
        mock_fetch_textures.side_effect = Exception("Internal Server Error")
        
        response = self.client.get('/textures/earth')
        self.assertEqual(response.status_code, 404)
        data = response.json
        self.assertIn('error', data)
        self.assertEqual(data['error'], "Internal Server Error")

if __name__ == '__main__':
    unittest.main()

