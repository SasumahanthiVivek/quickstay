import React from "react";
import ownerImage from "../assets/image.jpg";

const About = () => {
  const hotelGallery = [
    {
      title: "Grand Lobby",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Executive Suite",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Skyline Rooftop Dining",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const operationStandards = [
    {
      title: "Arrival Precision",
      detail:
        "Pre-arrival notes, room readiness checks, and smooth check-in coordination reduce wait time and improve first impressions.",
    },
    {
      title: "Housekeeping Discipline",
      detail:
        "Daily QA-based cleaning flow with checklist validation ensures every room meets comfort and hygiene expectations.",
    },
    {
      title: "Service Recovery",
      detail:
        "When issues happen, our team follows a clear response path with timely updates and practical resolution steps.",
    },
  ];

  return (
    <div className="pt-24 md:pt-28 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pb-16 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-center bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10">
          <div>
            <p className="inline-block text-sm font-medium bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
              About Urbanza Suites
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold leading-tight text-slate-900">
              Leadership Rooted in Service Excellence
            </h1>
            <p className="mt-5 text-slate-700 text-base md:text-lg leading-relaxed">
              I am Vivek Sasumahanthi, owner of Urbanza Suites. My vision is to
              build a hotel known for refined comfort, dependable quality, and a
              warm, personalized guest journey from arrival to departure.
            </p>
            <p className="mt-4 text-slate-700 text-base leading-relaxed">
              Under my leadership, our team follows professional hospitality
              standards with strong attention to detail, timely service, and
              guest-first care to ensure every stay feels premium, seamless, and
              trustworthy for business and leisure travelers.
            </p>
          </div>

          <div className="relative group w-full max-w-[420px] mx-auto lg:ml-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-[28px] blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <img
                src={ownerImage}
                alt="Hotel owner portrait"
                className="w-full aspect-[3/4] object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10 mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-slate-300">
              <p className="text-base font-semibold tracking-wide text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                Vivek Sasumahanthi
              </p>
              <p className="text-sm text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                Owner, Urbanza Suites
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Signature Comfort</h3>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Spacious suites, premium bedding, and elegant interiors designed to
              help every guest relax, recover, and feel at home.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Location</h3>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Minutes away from business districts, shopping, and landmarks so
              guests spend less time commuting and more time enjoying their stay.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Trusted Service</h3>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              24/7 front desk assistance, transparent communication, and a
              hospitality-first team committed to consistent quality.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
              Inside Our Hotel
            </h2>
            <p className="mt-2 text-slate-600">
              A quick look at the spaces our guests love most.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {hotelGallery.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[190px] object-cover rounded-xl transition-transform duration-500 hover:scale-[1.03]"
                />
                <p className="mt-3 text-sm font-medium text-slate-700">{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-10">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 lg:gap-10 items-stretch">
            <div className="space-y-5">
              <p className="inline-block text-xs uppercase tracking-[0.22em] text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                Operational Excellence
              </p>
              <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900 leading-tight">
                Professional hospitality systems behind every guest stay
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Beyond design and comfort, Urbanza Suites runs on clear service
                standards. Our team follows defined workflows so guests receive
                consistent quality across rooms, response times, and support touchpoints.
              </p>

              <div className="space-y-3">
                {operationStandards.map((item, index) => (
                  <article
                    key={item.title}
                    className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5"
                  >
                    <p className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                      Standard {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-full">
              <figure className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white h-full min-h-[220px]">
                <img
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80"
                  alt="Luxury hotel reception lounge"
                  className="w-full h-[220px] md:h-[250px] object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-slate-700">
                  Reception and concierge spaces designed for fast, welcoming check-ins.
                </figcaption>
              </figure>

              <figure className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white h-full min-h-[220px]">
                <img
                  src="https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&w=1400&q=80"
                  alt="Luxury hotel restaurant interior"
                  className="w-full h-[220px] md:h-[250px] object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-slate-700">
                  Curated dining and social zones that elevate both business and leisure stays.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-slate-100 rounded-2xl p-6 md:p-10">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-playfair font-semibold">
                Guest Experience Promise
              </h2>
              <p className="text-blue-200 font-medium mt-2">Managed by Vivek Sasumahanthi • Owner</p>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Urbanza Suites is led with a clear vision: premium service should be
                personal, consistent, and warm. Every team member is trained to
                deliver attentive support, from arrival assistance and dining
                recommendations to fast issue resolution during your stay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4 w-full">
              <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700 hover:border-blue-300 transition-colors duration-300">
                <p className="text-xl font-semibold">24/7</p>
                <p className="text-xs text-slate-300">Front Desk Support</p>
              </div>
              <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700 hover:border-blue-300 transition-colors duration-300">
                <p className="text-xl font-semibold">4.8/5</p>
                <p className="text-xs text-slate-300">Guest Satisfaction</p>
              </div>
              <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700 hover:border-blue-300 transition-colors duration-300">
                <p className="text-xl font-semibold">Top 10</p>
                <p className="text-xs text-slate-300">City Luxury Hotel</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
