import { ppmToData } from "./Map";

class PopupProps {
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
  lng?: number;
  lat?: number;
}
export default (props: PopupProps) => {
  let {
    active = false,
    ppm = 0,
    co_ppm = 0,
    co2_ppm = 20,
    alkol_ppm = 112,
    aseton_ppm = 24,
    id = "",
    locationText = "",
    lng = 0,
    lat = 0,
  } = props;
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
              {Number(lat).toFixed(4) +
                ", " +
                Number(lng).toFixed(4)}
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
      <Body {...props} />
      <div className="border-t border-gray-200 text-gray-400 p-3">
        Ekranı aşağıya doğru kaydırarak daha detaylı bilgi ve grafiklere
        ulaşabilirsiniz
      </div>
    </div>
  );
};

const Body = ({
  temperature = 0,
  humidity = 0,
  heat_index = 0,
  pressure = 0,
  altitude = 0,
}: PopupProps) => {
  return (
    <div className="my-3 w-full">
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
  );
};
