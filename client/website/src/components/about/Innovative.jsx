import React from "react";
import image from "../../assets/image.jpg";

function Innovative({ innovative }) {
  console.log(innovative);
  return (
    <div className="flex flex-col text-black bg-white mt-10">
      <div className="w-[40%] ps-[5rem] p-10">
        <h4 className="text-base font-bold text-[#4aab3d]">
          {innovative.text}
        </h4>
        <h2 className="text-4xl font-bold">{innovative.header}</h2>
      </div>
      <div className="flex p-6 items-stretch justify-evenly">
        <div className="flex flex-col gap-4  w-[20%]">
          <div className="p-2">
            <h3 className="text-[#4aab3d] text-[40px] font-bold">
              {innovative.experienceYears}+{" "}
              <span className="text-2xl">Years</span>
            </h3>
            <p className="text-base text-black">
              Years of experience in software development
            </p>
          </div>
          <hr className="text-gray-400" />
          <div className="p-2">
            <h3 className="text-[#4aab3d] text-[40px] font-bold">
              {innovative.awards}
              <span className="text-2xl">Awards</span>
            </h3>
            <p className="text-base text-black">
              Winning awards as one of the world company
            </p>
          </div>{" "}
          <hr className="text-gray-400" />{" "}
          <div className="p-2">
            <h3 className="text-[#4aab3d] text-[40px] font-bold">
              {innovative.project}+ <span className="text-2xl">Projects</span>
            </h3>
            <p className="text-base text-black">
              Trusted by clients to solve complex challenges with
              technology-driven results.
            </p>
          </div>
        </div>

        <div className="h-auto">
          <img
            src={`http://localhost:8080${innovative.aboutImage}`}
            className="w-[90%] h-full"
            alt="About"
          />
        </div>
        <div className="w-[29%] flex flex-col gap-4 py-2">
          <p>{innovative.description.slice(0, 330)}</p>
          <p>{innovative.description.slice(330)}</p>
          <h3 className="font-bold text-xl">{innovative.author}</h3>
          <h4 className="text-[#4aab3d] font-bold">
            {innovative.authorPosition}
          </h4>
        </div>
      </div>
      <div className="w-full h-full relative">
        <img src={image} alt="Image" className="h-full w-screen" />

        <div className="absolute top-1/6 flex justify-between items-end p-6 text-white">
            <div className="w-[40%] flex flex-col h=gap-2">
          <p className="font-bold text-[#4aab3d]">Accurate Data, Bold Innovation</p>
          <h2 className="text-white text-4xl">
            Innovative Insights Driven by Market Accuracy
          </h2>
          </div>
          <h3 className="w-[30%]">
           
            We deliver innovative insights through precise market research,
            empowering smarter decisions, strategic growth, and impactful
            results across dynamic industries.
          </h3>
        </div>
        <div className="absolute top-1/2 flex  p-6 gap-3">
        {innovative.innovativeIdeas.map((idea)=>{
            return (
                <>
                <div className="relative flex flex-col rounded-md bg-[#121212] p-6 px-8 text-white gap-2 py-16">
                   <div className="absolute top-[-2rem] left-6 w-16 h-16 rounded-full bg-[#4aab3d]"></div>
                    <h3 className="font-bold text-xl">{idea.idea}</h3>
                    <p>{idea.ideaDescription}</p>
                </div>
                </>
            )
        })}
        </div>
      </div>
    </div>
  );
}

export default Innovative;
