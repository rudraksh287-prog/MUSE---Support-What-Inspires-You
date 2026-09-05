


import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
   
      <div className="flex flex-col gap-5 justify-center items-center h-[44vh] text-center   md:px-0 px-4">

        <div className="font-bold text-5xl flex justify-center items-center gap-2">
          <span>Support what inspires you.</span>
          <span className="drop-shadow-[0_4px_12px_rgba(168,85,247,0.35)]">
            <img width={88} src="/tea.gif" alt="Chai" />
          </span>
        </div>

        <p className="text-center  max-w-2xl font-bold text-lg text-gray-600 leading-relaxed">
          A crowdfunding platform for creators. Get funded by your fans and
          followers and turn your ideas into reality.
        </p>

        <div className="flex gap-2 mt-1">
          <Link href={"/login"}>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-300/40 transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-2xl text-sm px-5 py-2.5"
            >
              Start Here
            </button>
          </Link>

          <Link href={"/about"}>
            <button
              type="button"
              className="text-purple-700 bg-white border border-purple-300 hover:bg-purple-50 hover:scale-105 transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-2xl text-sm px-5 py-2.5"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>


      <div className="bg-black opacity-60 h-0.5"></div>


      <div className="text-black container mx-auto pb-22 pt-10 px-4">

        <h2 className="text-3xl font-bold text-center my-10">
          Your Fans Can support You
        </h2>

        <div className="flex gap-5 items-center flex-col md:flex-row justify-around">

          <div className="item space-y-3 flex flex-col items-center justify-center text-center max-w-xs p-6 rounded-2xl border border-gray-200 bg-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          


            <img
              className="bg-slate-400 rounded-full p-2"
              width={88}
              src="/man.gif"
              alt="Supporters"
            />

            <p className="font-bold text-center text-lg">
              Build Your Supporter Base
            </p>

            <p className="text-gray-600">
              Turn your followers into supporters who believe in your work
              and want to see you succeed.
            </p>
          </div>


          <div className="item space-y-3 flex flex-col items-center justify-center text-center max-w-xs p-6 rounded-2xl border border-gray-200 bg-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

            <img
              className="bg-slate-400 rounded-full p-2"
              width={88}
              src="/coin.gif"
              alt="Funding"
            />

            <p className="font-bold text-center text-lg">
              Get Funded
            </p>

            <p className="text-gray-600">
              Receive direct financial support from your fans and use it
              to bring your creative ideas and projects to life.
            </p>
          </div>


          <div className="item space-y-3 flex flex-col items-center justify-center text-center max-w-xs p-6 rounded-2xl border border-gray-200 bg-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

            <img
              className="bg-slate-400 rounded-full p-2"
              width={88}
              src="/group.gif"
              alt="Community"
            />

            <p className="font-bold text-center text-lg">
              Grow Your Community
            </p>

            <p className="text-gray-600">
              Connect with people who love what you create and build a
              community around your journey.
            </p>
          </div>

        </div>
      </div>


      <div className="bg-black opacity-60 h-0.5"></div>


   
      <div className="text-black container mx-auto pb-22 pt-10 px-4">

        <h2 className="text-3xl font-bold text-center my-10">
          Why MUSE?
        </h2>

        <div className="flex gap-5 flex-col items-center md:flex-row justify-around">

          <div className="item space-y-3 flex flex-col items-center justify-center text-center max-w-xs p-6 rounded-2xl border border-gray-200 bg-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

            <img
              className="bg-slate-400 rounded-full p-2"
              width={88}
              src="/tea.gif"
              alt="Simple support"
            />

            <p className="font-bold text-center text-lg">
              Simple & Direct
            </p>

            <p className="text-gray-600">
              No complicated process. Your fans can support you directly
              with just a few clicks.
            </p>
          </div>


          <div className="item space-y-3 flex flex-col items-center justify-center text-center max-w-xs p-6 rounded-2xl border border-gray-200 bg-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

            <img
              className="bg-slate-400 rounded-full p-2"
              width={88}
              src="/coin.gif"
              alt="Creator funding"
            />

            <p className="font-bold text-center text-lg">
              Your Work, Your Money
            </p>

            <p className="text-gray-600">
              Use the support you receive to fund your projects, improve
              your craft, or simply keep creating.
            </p>
          </div>


          <div className="item space-y-3 flex flex-col items-center justify-center text-center max-w-xs p-6 rounded-2xl border border-gray-200 bg-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

            <img
              className="bg-slate-400 rounded-full p-2"
              width={88}
              src="/group.gif"
              alt="Creator community"
            />

            <p className="font-bold text-center text-lg">
              Made for Creators
            </p>

            <p className="text-gray-600">
              Whether you're an artist, developer, musician, writer, or
              simply building something you love... we've got you covered.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}