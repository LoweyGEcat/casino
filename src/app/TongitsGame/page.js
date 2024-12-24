"use client";
import React, { useState } from "react";
import Image from "next/image";
import PercentageLoader from "../components/PercentageLoad";
import SnowAnimation from "../components/snowflakes";
function TogitsGame() {
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div>
      {!isFinished ? (
        <PercentageLoader setIsFinished={setIsFinished} />
      ) : (
        <div className="w-full h-full relative">
          <div className=" inset-0 flex items-center justify-center z-50 h-[91vh]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(2, 24, 33, 0.8) 25%, rgba(149, 74, 74, 0.8) 44%)",
                zIndex: -1, // Send it to the background
              }}
            ></div>
            <div className="left-5 absolute top-5">
              <div className="flex flex-row gap-3">
                <div>
                  <button>
                    <Image
                      src="/image/contactUs.svg"
                      alt="My image"
                      width={40} // You need to specify width and height
                      height={40} // You need to specify width and height
                    />
                  </button>
                </div>
                <div>
                  <button>
                    {" "}
                    <Image
                      src="/image/settings.svg"
                      alt="My image"
                      width={40} // You need to specify width and height
                      height={40} // You need to specify width and height
                    />
                  </button>
                </div>
                <div>
                  <button>
                    {" "}
                    <Image
                      src="/image/question.svg"
                      alt="My image"
                      width={40} // You need to specify width and height
                      height={40} // You need to specify width and height
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[30rem] text-center">
              <div className="py-10">
                <Image
                  src="/image/svg_land.svg"
                  alt="Gon Portrait"
                  width={1000} // You need to specify width and height
                  height={1000} // You need to specify width and height
                />
              </div>
              <div
                className="h-24 w-full justify-between overflow-hidden flex flex-col gap-10 stroke-1 text-white stroke-black font-black text-2xl landing"
                style={{
                  WebkitTextStroke: "0.5px black",
                  textStroke: "0.5px black", // Fallback
                }}
              >
                <div>Choose Your Game Mode</div>
                <div className="flex flex-row gap-5 justify-between ">
                  <div>
                    <button>Play with bot</button>
                  </div>
                  <div>
                    <button>Live Game</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-screen bg-black h-16 relative flex justify-center items-center wood">
            <div
              className="absolute flex flex-row gap-2"
              style={{
                WebkitTextStroke: "0.5px black",
                textStroke: "0.5px black", // Fallback
              }}
            >
              <input type="checkbox" id="acceptTerms" />
              <p>Accept Terms and Condition</p>
            </div>
            <img
              src="/image/wood.svg"
              alt="My image"
              className="w-full h-auto"
            />
          </div>
          <SnowAnimation />
        </div>
      )}
    </div>
  );
}

export default TogitsGame;
