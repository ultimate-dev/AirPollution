import ReactDOMServer from "react-dom/server";
import { useRef, useEffect, useState } from "react";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

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
}
export const Marker = ({
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
          ReactDOMServer.renderToString(
            <RenderPopup {...data} active={active} />
          )
        )
        .setLngLat([lng, lat]);

      new mapboxgl.Marker(ref.current)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
    }
  }, [map]);

  return (
    <div ref={ref}>
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

class RenderPopupProps {
  active?: boolean;
  ppm?: number;
  co_ppm?: number;
  co2_ppm?: number;
  alkol_ppm?: number;
  aseton_ppm?: number;
  id?: string;
  locationText?: string;
  temperature?: number;
  humidity?: number;
  heat_index?: number;
  pressure?: number;
  altitude?: number;
  longitude?: number;
  latitude?: number;
}

const RenderPopup = ({
  active = false,
  ppm = 0,
  co_ppm = 0,
  co2_ppm = 20,
  alkol_ppm = 112,
  aseton_ppm = 24,
  id = "",
  locationText = "",
  temperature = 0,
  humidity = 0,
  heat_index = 0,
  pressure = 0,
  altitude = 0,
  longitude = 0,
  latitude = 0,
}: RenderPopupProps) => {
  let { color, title } = ppmToData(ppm);
  return (
    <div className="w-96 bg-white rounded-lg p-5 shadow">
      <div className="flex items-start justify-start">
        <div className="relative p-1">
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

          <div
            className={
              "relative z-20 rounded-md flex flex-col justify-center items-center w-20 h-20 bg-" +
              color
            }
          >
            <span
              className="font-semibold text-xl text-white"
              style={{ lineHeight: 1 }}
            >
              {ppm}
            </span>
            <span className="-mb-2 -mt-1 text-white opacity-50 font-medium">
              ppm
            </span>
          </div>
        </div>
        <div className="ml-3 flex-1 ">
          <div className="font-medium text-gray-400 flex items-center justify-between">
            <div>
              <i className="ri-map-pin-2-fill"></i>
              {locationText} (
              {Number(latitude).toFixed(4) +
                ", " +
                Number(longitude).toFixed(4)}
              )
            </div>
            <div>#{id}</div>
          </div>
          <div className={"font-semibold text-xl text-" + color}>{title}</div>
          <div className="flex text-center border-t text-gray-400 border-gray-100 pt-1 text-md font-medium">
            <span className="flex-1 border-r border-gray-100 px-0.5">
              <small>(CO)</small>
              <div className={"-mt-2 text-opacity-70 text-" + color}>
                {co_ppm}ppm
              </div>
            </span>
            <span className="flex-1 border-r border-gray-100 px-0.5">
              <small>(CO2)</small>
              <div className={"-mt-2 text-opacity-70 text-" + color}>
                {co2_ppm}ppm
              </div>
            </span>
            <span className="flex-1 border-r border-gray-100 px-0.5">
              <small>(Alkol)</small>
              <div className={"-mt-2 text-opacity-70 text-" + color}>
                {alkol_ppm}ppm
              </div>
            </span>
            <span className="flex-1 border-gray-100 px-0.5">
              <small>(Aseton)</small>
              <div className={"-mt-2 text-opacity-70 text-" + color}>
                {aseton_ppm}ppm
              </div>
            </span>
          </div>
        </div>
      </div>
      <div className="my-3">
        <div className="flex -mx-1 my-2">
          <div className="flex-1 mx-1 bg-gray-100 rounded p-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-500 font-medium">Sıcaklık</div>
              <div className="text-lg font-medium">
                <span>{temperature}</span>
                <span className="ml-0.5 text-gray-500">C°</span>
              </div>
            </div>
          </div>
          <div className="flex-1 mx-1 bg-gray-100 rounded p-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-500 font-medium">Nem</div>
              <div className="text-lg font-medium">
                <span>{humidity}</span>
                <span className="ml-0.5 text-gray-500">%</span>
              </div>
            </div>
          </div>
          <div className="flex-1 mx-1 bg-gray-100 rounded p-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-500 font-medium">Hissedilen</div>
              <div className="text-lg font-medium">
                <span>{heat_index}</span>
                <span className="ml-0.5 text-gray-500">C°</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex -mx-1 my-2">
          <div className="flex-1 mx-1 bg-gray-100 rounded p-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-500 font-medium">Basınç</div>
              <div className="text-lg font-medium">
                <span>{Number(pressure).toFixed(4)}</span>
                <span className="ml-0.5 text-gray-500">Pa</span>
              </div>
            </div>
          </div>
          <div className="flex-1 mx-1 bg-gray-100 rounded p-2">
            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-500 font-medium">Rakım</div>
              <div className="text-lg font-medium">
                <span>{Number(altitude).toFixed(4)}</span>
                <span className="ml-0.5 text-gray-500">m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

const ppmToData = (ppm: number) => {
  if (ppm > 300) return { title: "Tehilikeli", color: "burgundy" };
  else if (ppm > 200) return { title: "Çok Sağlıksız", color: "purple" };
  else if (ppm > 150) return { title: "Sağlıksız", color: "red" };
  else if (ppm > 100) return { title: "Hassas", color: "orange" };
  else if (ppm > 50) return { title: "Orta", color: "yellow" };
  else if (ppm >= 0) return { title: "İyi", color: "green" };
  else return { title: "", color: "white" };
};
