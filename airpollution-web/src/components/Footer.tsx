export default () => {
  return (
    <div className="fixed z-50 w-full left-0 bottom-0 p-2" data-aos="fade-up">
      <div className="overflow-hidden rounded-lg h-auto flex text-center flex-wrap">
        <div className="md:w-1/6 w-1/3 bg-green flex flex-col justify-center items-center text-white p-2">
          <div className="lg:text-lg uppercase font-semibold">İYİ</div>
          <div className="-mt-2">(0 - 50)</div>
        </div>
        <div className="md:w-1/6 w-1/3 bg-yellow flex flex-col justify-center items-center text-white p-2">
          <div className="lg:text-lg uppercase font-semibold">ORTA</div>
          <div className="-mt-2">(51 - 100)</div>
        </div>
        <div className="md:w-1/6 w-1/3 bg-orange flex flex-col justify-center items-center text-white p-2">
          <div className="lg:text-lg uppercase font-semibold">HASSAS</div>
          <div className="-mt-2">(101 - 150)</div>
        </div>
        <div className="md:w-1/6 w-1/3 bg-red flex flex-col justify-center items-center text-white p-2">
          <div className="lg:text-lg uppercase font-semibold">SAĞLIKSIZ</div>
          <div className="-mt-2">(151 - 200)</div>
        </div>
        <div className="md:w-1/6 w-1/3 bg-purple flex flex-col justify-center items-center text-white p-2">
          <div className="lg:text-lg uppercase font-semibold">ÇOK SAĞLIKSIZ</div>
          <div className="-mt-2">(201 - 300)</div>
        </div>
        <div className="md:w-1/6 w-1/3 bg-burgundy flex flex-col justify-center items-center text-white p-2">
          <div className="lg:text-lg uppercase font-semibold">TEHLİKELİ</div>
          <div className="-mt-2">(301 - 500)</div>
        </div>
      </div>
    </div>
  );
};
