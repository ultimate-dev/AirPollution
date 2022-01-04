import { Fragment, useEffect, useState } from "react";
import AOS from "aos";
// Configs
import * as configs from "./configs";
// Constants
import maps from "./constants/maps";
// Components
import Navbar from "./components/Navbar";
import Map, { Marker } from "./components/Map";
import Footer from "./components/Footer";

function App() {
  //AOS
  useEffect(() => {
    AOS.init({
      offset: 60,
      duration: 600,
      once: true,
      easing: "ease",
    });
    AOS.refresh();
  }, []);

  return (
    <div className="w-screen h-screen text-gray-800">
      <Map
        configs={{
          token: configs.MAP_TOKEN,
          style: maps[4].style,
          lng: 35.1748,
          lat: 38.6908,
          zoom: 5.5,
        }}
      >
        {(map) => (
          <Fragment>
            <Navbar setStyle={(style: string) => map.setStyle(style)} />
            <Marker
              active={true}
              map={map}
              lat={38.655520627117816}
              lng={39.15497285554779}
              data={{
                id: "ELZ_1",
                locationText: "Elazığ/Merkez",
                ppm: 62,
                co_ppm: 18,
                co2_ppm: 20,
                alkol_ppm: 112,
                aseton_ppm: 24,
                temperature: 16,
                humidity: 25,
                heat_index: 18,
                pressure: 8080.1212,
                altitude: 1010.1212,
                longitude: 35.1748,
                latitude: 38.6908,
              }}
            />

            <Marker
              map={map}
              lat={40.95951012419908}
              lng={35.66236926880983}
              data={{
                id: "SAM_1",
                locationText: "Samsun/Havza",
                ppm: 50,
                co_ppm: 18,
                co2_ppm: 20,
                alkol_ppm: 112,
                aseton_ppm: 24,
                temperature: 16,
                humidity: 25,
                heat_index: 18,
                pressure: 8080.1212,
                altitude: 1010.1212,
                longitude: 35.1748,
                latitude: 38.6908,
              }}
            />

            <Marker
              map={map}
              lat={39.10927895447871}
              lng={27.185462726419868}
              data={{
                id: "IZM_1",
                locationText: "İzmir/Bergama",
                ppm: 120,
                co_ppm: 18,
                co2_ppm: 20,
                alkol_ppm: 112,
                aseton_ppm: 24,
                temperature: 16,
                humidity: 25,
                heat_index: 18,
                pressure: 8080.1212,
                altitude: 1010.1212,
                latitude: 38.6908,
                longitude: 35.1748,
              }}
            />

            <Marker
              map={map}
              lat={39.93173061212778}
              lng={32.835540060005776}
              data={{
                id: "ANK_1",
                locationText: "Ankara/Çankaya",
                ppm: 255,
                co_ppm: 18,
                co2_ppm: 20,
                alkol_ppm: 112,
                aseton_ppm: 24,
                temperature: 16,
                humidity: 25,
                heat_index: 18,
                pressure: 8080.1212,
                altitude: 1010.1212,
                latitude: 38.6908,
                longitude: 35.1748,
              }}
            />

            <Footer />
          </Fragment>
        )}
      </Map>
    </div>
  );
}

export default App;
