"use client";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();

  const generateButton = () => {
    push("/generate");
  };
  return (
    <div className="flex flex-col mt-5 items-center">
      <div>
        <div className="flex ml-5 gap-24 mb-4">
          <div
            className="w-5 h-5 bg-no-repeat"
            style={{ backgroundImage: `url('exit.svg')` }}
            onClick={() => {
              push("/");
            }}
          ></div>
          <div className="text-[16px] font-semibold w-50">New photo post</div>
        </div>
        <hr className="flex-grow border-t border-gray-300 w-100" />
      </div>
      <div className="flex flex-col gap-3 items-center mt-70">
        <div
          className="w-35 h-25 bg-no-repeat"
          style={{ backgroundImage: `url('frame.svg')` }}
        ></div>
        <button className="text-white w-40 bg-sky-500 hover:bg-sky-600 font-bold rounded-sm text-sm px-7 py-2">
          Photo library
        </button>
        <div
          onClick={generateButton}
          className="text-[14px] text-sky-500 font-bold cursor-pointer"
        >
          Generate with AI
        </div>
      </div>
    </div>
  );
};

export default Page;
