function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Citizen",
      review:
        "This platform helped me receive flood alerts on time. Very useful!",
    },
    {
      name: "Priya Verma",
      role: "Volunteer",
      review:
        "Reporting incidents is very easy and the dashboard is excellent.",
    },
    {
      name: "Disaster Response Team",
      role: "Government",
      review:
        "A reliable emergency management system for citizens and authorities.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-4">
          What People Say
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Trusted by thousands of users.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl p-8 shadow hover:shadow-xl transition"
            >
              <p className="italic text-gray-700 mb-6">
                "{item.review}"
              </p>

              <h3 className="font-bold text-xl">
                {item.name}
              </h3>

              <p className="text-red-600">
                {item.role}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;