import React from "react";
import { assets, exclusiveOffers } from "../assets/assets";

const experienceHighlights = [
  {
    title: "Curated Luxury Stays",
    description:
      "Every property is selected for design quality, guest satisfaction, and service consistency to deliver a dependable premium experience.",
  },
  {
    title: "Seamless Booking Journey",
    description:
      "From search to confirmation, our streamlined process helps travelers reserve the right room quickly and confidently.",
  },
  {
    title: "Trusted Hospitality Standards",
    description:
      "We collaborate with verified hotel partners who maintain high standards in cleanliness, safety, and guest support.",
  },
];

const guestReviews = [
  {
    name: "Riya Malhotra",
    city: "Mumbai",
    quote:
      "From check-in to check-out, everything felt polished and calm. The room was spotless, the staff was warm, and breakfast quality was excellent.",
    stay: "Business Stay • 3 Nights",
    image: assets.roomImg1,
  },
  {
    name: "Daniel Brooks",
    city: "London",
    quote:
      "The concierge team planned our city itinerary perfectly. The location, service speed, and room comfort made this one of my best hotel stays.",
    stay: "Leisure Stay • 4 Nights",
    image: assets.roomImg2,
  },
  {
    name: "Aarav Menon",
    city: "Bengaluru",
    quote:
      "Great ambiance, premium amenities, and a very professional team. The evening dining experience and city view were outstanding.",
    stay: "Family Stay • 2 Nights",
    image: assets.roomImg3,
  },
];

const experienceStats = [
  { value: "24/7", label: "Guest Assistance" },
  { value: "4.8/5", label: "Average Stay Rating" },
  { value: "98%", label: "Smooth Check-Ins" },
  { value: "120+", label: "Premium Rooms" },
];

const serviceJourney = [
  {
    title: "Before Arrival",
    description: "Fast confirmation, clear booking details, and support for special requests before check-in.",
  },
  {
    title: "During Stay",
    description: "Reliable housekeeping, room service, and quick response from trained hospitality staff.",
  },
  {
    title: "After Checkout",
    description: "Simple billing, feedback follow-up, and priority support for your next reservation.",
  },
];

const Experience = () => {
  return (
    <div className="pt-24 md:pt-28 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pb-16 bg-white text-slate-800">
      <div className="max-w-6xl mx-auto space-y-14">
        <section className="grid lg:grid-cols-2 gap-8 items-center bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10">
          <div>
            <p className="inline-block text-sm font-medium bg-blue-100 text-blue-700 px-4 py-1 rounded-full mb-4">
              Urbanza Suites Experience
            </p>
            <h1 className="text-4xl md:text-5xl font-playfair font-semibold leading-tight text-slate-900">
              Experience Hospitality Designed Around Comfort
            </h1>
            <p className="mt-5 text-slate-700 text-base md:text-lg leading-relaxed">
              At Urbanza Suites, every stay is designed with detail and purpose.
              From elegant rooms and curated dining to attentive service, we focus
              on making each guest journey smooth, premium, and memorable.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={assets.regImage}
              alt="Luxury hotel lounge"
              className="relative w-full h-[340px] md:h-[420px] object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {experienceStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <p className="text-2xl md:text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs md:text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-6 text-slate-900">
            What Makes Our Experience Exceptional
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {experienceHighlights.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={assets.roomImg4}
              alt="Hotel front desk service"
              className="w-full h-[280px] object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-white">
              Service Quality You Can Count On
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Our hospitality team is trained to maintain high standards at every
              touchpoint. From rapid check-in and room readiness to concierge
              assistance and responsive support, we ensure a consistent premium
              experience throughout your stay.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
              End-to-End Guest Journey
            </h2>
            <p className="mt-2 text-slate-600">
              Every stage of your stay is designed to be smooth, professional, and dependable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {serviceJourney.map((item, index) => (
              <article
                key={item.title}
                className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
              Featured Stay Experiences
            </h2>
            <p className="mt-2 text-slate-600">
              Curated stay packages designed for comfort, value, and memorable travel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exclusiveOffers.map((offer) => (
              <article
                key={offer._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <p className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    Save {offer.priceOff}%
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{offer.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{offer.description}</p>
                  <p className="mt-3 text-xs font-medium text-slate-500">Offer valid till {offer.expiryDate}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
              What Our Guests Say
            </h2>
            <p className="mt-2 text-slate-600">
              Real feedback from guests who recently stayed at Urbanza Suites.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {guestReviews.map((review) => (
              <article
                key={review.name}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.city}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">“{review.quote}”</p>
                <p className="mt-4 text-xs font-medium text-blue-700">{review.stay}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Experience;
