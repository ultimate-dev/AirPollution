import ReactDOMServer from "react-dom/server";
import { useRef, useEffect, useState } from "react";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
// Components
import Popup from "./Popup";

/**
 * useMap
 */
export class useMapProps {
  token?: string;
  style?: string;
  lng?: number;
  lat?: number;
  zoom?: number;
}
export const useMap = ({ token, style, lng, lat, zoom }: useMapProps) => {
  mapboxgl.accessToken = token;

  let mapContainer: any = useRef(null);
  let [map, setMap]: any = useState(null);

  useEffect(() => {
    if (map) return;
    setMap(
      new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: [lng, lat],
        zoom: zoom,
      })
    );
  });
  return { map, mapContainer };
};

/**
 * Map
 */
export class MapProps {
  children?: (map: any) => any;
  configs?: useMapProps;
}

export default ({ children, configs }: MapProps) => {
  let { map, mapContainer } = useMap({ ...configs });

  return (
    <>
      <div ref={mapContainer} className="w-full h-full">
        {children && children(map)}
      </div>
    </>
  );
};

/**
 * useMarker
 */
export class MarkerProps {
  map?: any;
  lng?: number;
  lat?: number;
  data?: any;
  active?: boolean;
  onClick?: () => void;
}
export const Marker = ({
  onClick = () => {},
  map,
  lng,
  lat,
  data,
  active = false,
}: MarkerProps) => {
  let ref: any = useRef();
  let { color } = ppmToData(data?.ppm);

  useEffect(() => {
    if (map) {
      let popup = new mapboxgl.Popup()
        .setHTML(
          ReactDOMServer.renderToString(<Popup {...data} active={active} />)
        )
        .setLngLat([lng, lat]);

      new mapboxgl.Marker(ref.current)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
    }
  }, [map]);

  return (
    <div ref={ref} onClick={onClick}>
      <div
        style={{
          transform:
            "scale(" + (map ? 5.5 / map.getZoom().toFixed(2) : 1) + ")",
        }}
        className="relative p-1 -mt-10"
      >
        <div
          className={
            "relative z-20 rounded-md flex justify-center items-center p-2 bg-" +
            color
          }
        >
          <span className="text-white font-medium" style={{ lineHeight: 1 }}>
            {data?.ppm}
          </span>
          <div className="absolute left-50 top-full -mt-0.5 w-6 overflow-hidden inline-block">
            <div
              className={
                "h-4 w-4 -rotate-45 transform origin-top-left rounded-sm bg-" +
                color
              }
            ></div>
          </div>
        </div>
        <div
          className={
            "absolute z-10 top-0 left-0 w-full h-full bg-opacity-60 rounded-lg " +
            (active
              ? "animate__animated animate__pulse animate__infinite"
              : "") +
            " bg-" +
            color
          }
        />
      </div>
    </div>
  );
};

export const ppmToData = (ppm: number) => {
  if (ppm > 300)
    return {
      title: "Tehilikeli",
      color: "burgundy",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  else if (ppm > 200)
    return {
      title: "Çok Sağlıksız",
      color: "purple",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  else if (ppm > 150)
    return {
      title: "Sağlıksız",
      color: "red",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  else if (ppm > 100)
    return {
      title: "Hassas",
      color: "orange",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  else if (ppm > 50)
    return {
      title: "Orta",
      color: "yellow",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  else if (ppm >= 0)
    return {
      title: "İyi",
      color: "green",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
  else
    return {
      title: "",
      color: "white",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
};
