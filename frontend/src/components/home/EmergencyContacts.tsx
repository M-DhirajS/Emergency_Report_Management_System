function EmergencyContacts() {

  const contacts = [
    {
      icon: "🚓",
      title: "Police",
      number: "100",
    },
    {
      icon: "🚑",
      title: "Ambulance",
      number: "108",
    },
    {
      icon: "🚒",
      title: "Fire Brigade",
      number: "101",
    },
    {
      icon: "🆘",
      title: "Disaster Helpline",
      number: "1070",
    },
  ];

  return (
    <section className="py-20 bg-red-50">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-4">
          Emergency Contacts
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Important emergency numbers available 24×7
        </p>

        <div className="grid md:grid-cols-4 gap-8">

          {contacts.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition"
            >

              <div className="text-6xl mb-4">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold">
                {item.title}
              </h3>

              <p className="text-red-600 text-3xl font-bold mt-4">
                {item.number}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default EmergencyContacts;