export default function UserHomePage() {
  return (
    <>
      <section className="flex items-center justify-between px-16 py-12 gap-10">
        {/* Left Content */}
        <div className="max-w-xl flex flex-col gap-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Learn More About Us HEALTH QUEUE Medical Institute
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            HealthQueue Appointment Management is a state-of-the-art facility
            dedicated to providing comprehensive healthcare services with
            compassion and expertise. Our team of skilled professionals is
            committed to delivering personalized care tailored to each patient's
            needs.
          </p>
        </div>

        {/* Right Image */}
        <div className="relative">
          <img src="/signin.png" alt="hero" className="w-300px animate-pulse" />

          {/* Background Vector */}
          <img
            src="/Vector.png"
            alt="vector"
            className="absolute -top-10 -right-10 -z-10 h-100px w-200px opacity-40"
          />
        </div>
      </section>
    </>
  );
}
