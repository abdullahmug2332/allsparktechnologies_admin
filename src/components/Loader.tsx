import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="w-full h-screen bg-[#18185e0c] flex items-center justify-center fixed top-0 right-0 " style={{zIndex:99}}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex:99
        }}
      >
        <TailSpin
          height="70"
          width="70"
          color="#18185E"
          ariaLabel="tail-spin-loading"
          radius="3"
          visible={true}
        />
      </div>
    </div>
  );
};

export default Loader;
