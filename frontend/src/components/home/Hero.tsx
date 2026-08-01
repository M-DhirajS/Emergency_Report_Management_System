import hero from "../../assets/hero.png";

function Hero() {
  return (
    <section className="bg-red-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">

        <div className="md:w-1/2">

          <h1 className="text-5xl font-bold mb-6">
            Emergency Report Management System
          </h1>

          <p className="text-lg mb-8">
            Stay Safe. Stay Connected.
            Report incidents instantly and receive emergency alerts in real time.
          </p>

          <div className="flex gap-4">

            <button className="bg-white text-red-600 px-6 py-3 rounded-lg">
              Report Incident
            </button>

            <button className="border border-white px-6 py-3 rounded-lg">
              View Alerts
            </button>

          </div>

        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">

          <img
            src={hero}
            alt="Emergency Hero"
            className="rounded-xl shadow-2xl w-full max-w-2xl"
          />

        </div>

      </div>
    </section>
  );
}

export default Hero;