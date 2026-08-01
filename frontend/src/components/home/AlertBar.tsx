function AlertBar() {
  return (
    <div className="bg-yellow-400 text-black py-3 overflow-hidden">

      <marquee
        behavior="scroll"
        direction="left"
        scrollAmount="8"
      >
        🚨 Heavy Rain Warning in Nashik |
        🌊 Flood Alert in Mumbai |
        🌪️ Cyclone Warning for Konkan Coast |
        🚑 Emergency Helpline : 112 |
        🔥 Forest Fire Alert in Satara
      </marquee>

    </div>
  );
}

export default AlertBar;