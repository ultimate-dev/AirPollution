import maps from "../constants/maps";

export class NavbarProps {
  setStyle?: (style: string) => void;
}
export default ({ setStyle = () => {} }: NavbarProps) => {
  return (
    <div className="fixed left-0 top-0 w-full z-50" data-aos="fade-down">
      <div className="w-full flex justify-between p-2">
        <div></div>
        <div className="flex -mx-1">
          {maps.map((item, key: number) => (
            <div
              onClick={() => setStyle(item.style)}
              key={key}
              className={"h-8 w-8 rounded shadow-sm mx-1 cursor-pointer"}
              style={{ backgroundColor: item.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
