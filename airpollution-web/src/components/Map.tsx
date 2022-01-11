import ReactDOMServer from "react-dom/server";
import React, { useRef, useEffect, useState } from "react";
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
        {map ? children && children(map) : null}
      </div>
    </>
  );
};

/**
 * Marker
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
  let [marker, setMarker]: any = useState(null);

  useEffect(() => {
    if (marker) {
      marker.setLngLat([lng, lat]);
      marker.getPopup().setHTML(
        ReactDOMServer.renderToString(
          <React.StrictMode>
            <Popup {...data} active={active} />
          </React.StrictMode>
        )
      );
    }
  }, [data, map]);

  useEffect(() => {
    if (map) {
      let popup = new mapboxgl.Popup()
        .setHTML(
          ReactDOMServer.renderToString(
            <React.StrictMode>
              <Popup {...data} active={active} />
            </React.StrictMode>
          )
        )
        .setLngLat([lng, lat]);
      setMarker(
        new mapboxgl.Marker(ref.current)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map)
      );
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
            {Number(data?.ppm).toFixed(0)}
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
      desc: " Acil durum alarmı için bir tetikleme noktasıdır. Toplumun tüm kesimleri, büyük bir ihtimalle etkilenecektir.",
    };
  else if (ppm > 200)
    return {
      title: "Çok Sağlıksız",
      color: "purple",
      desc: "Sağlık alarmı için bir tetikleme noktasıdır. Toplumun tüm kesimleri, çok ciddi düzeyde etkilenebilir.",
    };
  else if (ppm > 150)
    return {
      title: "Sağlıksız",
      color: "red",
      desc: "Hassas gruplar ciddi sağlık sorunları yaşayabilir. Genel halkın bazı sağlık etkileri yaşaması muhtemeldir.",
    };
  else if (ppm > 100)
    return {
      title: "Hassas",
      color: "orange",
      desc: "Toplumun belli bir kesimi, özellikle belli kirleticilere karşı hassastır. Bu grubun, genel nüfusa göre daha düşük seviyelerde dahi etkilenmeleri muhtemeldir. Örneğin, solunum rahatsızlığı olan kişiler, ozon kirleticisine maruz kalmaları sonucu daha fazla risk taşırken; kalp rahatsızlığı olan kişiler havadaki partikül kirleticilerine maruz kalmaları sonucu daha fazla risk taşırlar. Genel olarak, toplumun büyük kesimi, bu aralıkta etkilenmez.",
    };
  else if (ppm > 50)
    return {
      title: "Orta",
      color: "yellow",
      desc: "Hava kalitesi kabul edilebilir, ancak bazı kirleticilerin, toplumun küçük bir kesiminde orta düzeyde sağlık etkisi olabilir. Örneğin, ozon kirleticisine  çok hassas olan kişilerde bazı solunuma bağlı hastalık belirtilerine rastlanabilir.",
    };
  else if (ppm >= 0)
    return {
      title: "İyi",
      color: "green",
      desc: "Hava kalitesinin tatmin edici, hava kirliliğinin çok az olduğu veya sağlık riskinin bulunmadığı anlamına gelir.",
    };
  else
    return {
      title: "",
      color: "white",
      desc: "404",
    };
};
