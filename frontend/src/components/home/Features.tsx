function Features() {
  const features = [
    {
      title: "Real-Time Alerts",
      desc: "Receive emergency alerts instantly on your device.",
      icon: "🚨",
    },
    {
      title: "Report Incidents",
      desc: "Citizens can report disasters with location and photos.",
      icon: "📢",
    },
    {
      title: "Nearby Shelters",
      desc: "Find the nearest safe shelter during emergencies.",
      icon: "🏠",
    },
    {
      title: "Emergency Contacts",
      desc: "Quick access to Police, Fire and Ambulance.",
      icon: "📞",
    },
    {
      title: "Live Updates",
      desc: "Stay updated with disaster news and weather.",
      icon: "🌧️",
    },
    {
      title: "Community Support",
      desc: "Help others and receive assistance quickly.",
      icon: "🤝",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-4">
          Our Features
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Everything you need during an emergency.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((feature, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
            >

              <div className="text-5xl mb-5">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.desc}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;