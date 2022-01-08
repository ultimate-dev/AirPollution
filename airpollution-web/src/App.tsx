import { Fragment, useEffect, useState } from "react";
import AOS from "aos";
import { io } from "socket.io-client";
// Configs
import * as configs from "./configs";
// Constants
import maps from "./constants/maps";
// Components
import Navbar from "./components/Navbar";
import Map, { Marker } from "./components/Map";
import Footer from "./components/Footer";
import Charts from "./components/Charts";
// Helpers
import { get } from "./helpers/http.helper";

const socket = io(configs.API_URL, {
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ["websocket"],
});

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

  let [select, setSelect]: any = useState(null);
  let [result, setResult]: any = useState([]);

  useEffect(() => {
    getDatas();
    socket.on("update", () => {
      getDatas();
    });
  }, []);
  const getDatas = async () => {
    await get("/api").then((res) => {
      console.log(res);
      if (res.result) setResult(res.result);
    });
  };

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

            {
              /**
               * Custom Markers
               */
              result.map((item: any, key: number) => (
                <Marker
                  key={key}
                  onClick={() => setSelect(item.id)}
                  active={item.active}
                  map={map}
                  lat={item.lat}
                  lng={item.lng}
                  data={{
                    ...item,
                  }}
                />
              ))
            }

            <Footer />
          </Fragment>
        )}
      </Map>
      {select && <Charts {...result.find((item: any) => item.id == select)} />}
    </div>
  );
}

export default App;
