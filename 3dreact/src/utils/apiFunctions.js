import * as THREE from 'three';

export const getStellars = (stellars) => {
    stellars.current = [
        {
            name: "Earth",
            mass: "5.972 x 10^24 kg",
            radius: "6,371 km",
            rings: "No",
            discovery: "Prehistoric",
            orbital_period: "365 days",
            lifetime: "4.5 billion years",
            link: "https://en.wikipedia.org/wiki/Earth",
            textures: {
                diffuse: "https://raw.githubusercontent.com/gist/juanmirod/081a0b45372f6da81469/raw/526488c67e82f8916f21c07c0b7707b6d5a3615c/earth_texture_map_1000px.jpg",
                normal: "",
                specular: "",
                emissive: "",
                opacity: "",
                ambient: ""
            },
            coordinates: { x: 150, y: 150, z: 0 }
        },
        {
            name: "Mars",
            mass: "6.39 x 10^23 kg",
            radius: "7,389.5 km",
            rings: "No",
            discovery: "Prehistoric",
            orbital_period: "687 days",
            lifetime: "4.6 billion years",
            link: "https://en.wikipedia.org/wiki/Mars",
            textures: {
                diffuse: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpYw5OTjlI5fnNWV5sFKUIhRIrCMJe7LQHjw&s",
                normal: "",
                specular: "",
                emissive: "",
                opacity: "",
                ambient: ""
            },
            coordinates: { x: 3080, y: 550, z: 200 }
        },
    ]
}