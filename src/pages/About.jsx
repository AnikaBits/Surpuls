// src/pages/About.jsx
// মার্জ করা ভার্সন: দুই About পেজের দরকারি অংশ একসাথে। FAQ আর Live Impact বাদ।
// থিম: হলুদ + গাঢ় সবুজ (Home-এর মতো), ইমোজির বদলে আইকন।
//
// সেকশনের ক্রম:
//   হিরো → আমাদের গল্প → মিশন ও ভিশন → মূল্যবোধ → আমরা কী করি →
//   NGO পার্টনার (আসল ডেটা) → Events → টিম → কমিউনিটি → শেষ CTA
//
// দরকার: components/LiveStats.jsx (শুধু Icon-এর জন্য), components/Navbar, components/Footer,
//        assets/img3.jpeg, assets/img4.jpeg

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Icon } from "../components/LiveStats";
import { useAuth } from "../context/AuthContext";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import anika from "../assets/anika.jpg";
import sufia from "../assets/sufia.jpg";
import tishma from "../assets/tishma.jpg";

// ========== এখানে নিজের তথ্য বসাও ==========

// Events: সত্যিকারের ইভেন্ট অনুযায়ী নাম, তারিখ ও ছবি বদলাও (কার্ড যোগ/কমানো যাবে)
const EVENTS = [
  { img: img3, title: "Food Campaign at Shristi Orphanage", date: "" },
  { img: img4, title: "Food Campaign at Shristi Orphanage", date: "" },
];

// টিম: নাম, ভূমিকা, ছবি (ছবি ফাঁকা ("") থাকলে হালকা রঙের বক্স দেখাবে)
const TEAM = [
  { name: "Sadia Farjana Anika", role: "Founder & Project Lead", img: anika },
  { name: "Sufia Akter", role: "Operations Lead", img: sufia },
  { name: "Miftahul jannat Tishma", role: "Outreach & Volunteer Coordinator", img:tishma},
  
];

// =========================================

const FONT = { fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" };

// হলুদ হাইলাইট
function Highlight({ children }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute -inset-x-2 -inset-y-1 bg-[#F2B01E]/70 -rotate-1 rounded-full z-0" aria-hidden="true" />
    </span>
  );
}

function Photo({ src, alt = "", className = "" }) {
  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} />;
  return <div className={`bg-[#ECE4C8] ${className}`} aria-hidden="true" />;
}

function Eyebrow({ children, dark = false }) {
  return (
    <span
      className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase ${
        dark ? "bg-white/10 border border-white/15 text-[#F6D98A]" : "bg-[#FFE9A8] text-[#8A5A00]"
      }`}
    >
      {children}
    </span>
  );
}

const MISSION_VISION = [
  {
    icon: "star",
    title: "Our Mission",
    text: "To reduce food waste by connecting individuals, restaurants and businesses with NGOs that can help make use of surplus food. We aim to encourage responsible sharing and community participation.",
    ring: "bg-[#FFE9A8] text-[#8A5A00]",
    bar: "bg-[#F2B01E]",
  },
  {
    icon: "search",
    title: "Our Vision",
    text: "A future where usable food is valued, communities are connected and fewer resources are wasted. We envision a society where sharing surplus food becomes a common and meaningful practice.",
    ring: "bg-[#DDF2E2] text-[#2F7A55]",
    bar: "bg-[#8FD19E]",
  },
];

const VALUES = [
  {
    icon: "bowl",
    title: "Reduce Food Waste",
    text: "We connect people who have surplus food with those who can use it.",
  },
  {
    icon: "handshake",
    title: "Connect Communities",
    text: "Donors, NGOs and volunteers come together to support people in need.",
  },
  {
    icon: "users",
    title: "Spread Kindness",
    text: "We believe every small act of kindness can create a meaningful difference.",
  },
  {
    icon: "chart",
    title: "Build a Better Future",
    text: "By sharing resources responsibly, we work toward a more sustainable community.",
  },
];

const SERVICES = [
  {
    icon: "bowl",
    title: "Surplus Food Sharing",
    text: "Donors list what they have, how much, where to collect it and when it expires.",
  },
  {
    icon: "bolt",
    title: "Urgent Food First",
    text: "Food with the least time left rises to the top, so NGOs collect it before it spoils.",
  },
  {
    icon: "handshake",
    title: "NGO Connection",
    text: "NGOs connect with food donors and explore the donations available near them.",
  },
  {
    icon: "truck",
    title: "Tracked Pickups",
    text: "Each donation moves from approved to picked up, on the way and delivered.",
  },
  {
    icon: "shield",
    title: "Trusted Accounts",
    text: "An admin reviews every donor and NGO before they can post or collect food.",
  },
  {
    icon: "users",
    title: "Food Waste Awareness",
    text: "We promote responsible food sharing and awareness about reducing food waste.",
  },
];

const COMMUNITY_POINTS = [
  "Connect with food-sharing communities",
  "Support responsible food donations",
  "Help reduce food waste",
];

function About() {
  const { users = [] } = useAuth();

  // আসল ডেটা: অনুমোদিত NGO তালিকা (না থাকলে সেকশন লুকানো)
  const approvedNgos = users.filter((u) => u.role === "ngo" && u.status === "approved");

  const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2E22]";

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#14231B] overflow-x-hidden" style={FONT}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&display=swap');`}</style>

      <Navbar />

      {/* ============ HERO ============ */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Eyebrow>About FoodShare</Eyebrow>

          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] text-[#0F2E22]">
            Empowering <Highlight>Communities,</Highlight>
            <br />
            Nourishing Futures
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[#3B4F43] max-w-lg">
            FoodShare is a community-focused platform that connects surplus food
            donors with NGOs and volunteers who can get it to people in need,
            before it spoils.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0F2E22] text-white font-semibold hover:bg-[#184230] transition shadow-lg shadow-[#0F2E22]/20 ${focus}`}
            >
              Join our mission
              <Icon name="arrow" className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className={`inline-flex items-center px-7 py-3 rounded-full bg-[#F2B01E] text-[#0F2E22] font-semibold hover:bg-[#FFC53D] transition ${focus}`}
            >
              Contact us
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl bg-[#F2B01E]" aria-hidden="true" />
          <img
            src={img3}
            alt="FoodShare community initiative"
            loading="lazy"
            className="relative w-full h-[320px] object-cover rounded-3xl shadow-xl"
          />

          {/* ভাসমান কার্ড */}
          <div className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-auto bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4">
            <span className="w-12 h-12 shrink-0 rounded-full bg-[#0F2E22] text-[#F2B01E] flex items-center justify-center">
              <Icon name="bowl" className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs text-[#3B4F43]">Our purpose</p>
              <p className="font-semibold text-[#0F2E22]">Good food. Better purpose.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ OUR STORY ============ */}
      <section className="bg-white mt-6">
        <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -bottom-3 -left-3 w-full h-full rounded-3xl bg-[#8FD19E]" aria-hidden="true" />
            <img
              src={img4}
              alt="Community food sharing"
              loading="lazy"
              className="relative w-full h-[340px] object-cover rounded-3xl shadow-lg"
            />
            <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0F2E22] shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#F2B01E]" aria-hidden="true" />
              Every meal matters
            </span>
          </div>

          <div>
            <Eyebrow>Our story</Eyebrow>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight text-[#0F2E22]">
              Why we created <Highlight>FoodShare</Highlight>
            </h2>

            <p className="mt-5 text-[#3B4F43] leading-7">
              Every day, usable food may go to waste while many people struggle
              to access enough meals. FoodShare was built around a simple idea:
              connect people who have extra food with organizations that can put
              it to good use.
            </p>
            <p className="mt-3 text-[#3B4F43] leading-7">
              The problem is timing, not shortage. Cooked food spoils within
              hours, so donors post food with an expiry time, NGOs see the most
              urgent listings first, and each pickup is tracked until it is
              delivered.
            </p>

            <Link
              to="/register"
              className={`inline-flex items-center gap-2 mt-7 px-7 py-3 rounded-full bg-[#0F2E22] text-white font-semibold hover:bg-[#184230] transition shadow-lg shadow-[#0F2E22]/20 ${focus}`}
            >
              Become a member
              <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ MISSION & VISION ============ */}
      <section className="bg-[#FFF6DB]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="text-center max-w-2xl mx-auto">
            <Eyebrow>What drives us</Eyebrow>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#0F2E22]">
              Our <Highlight>mission</Highlight> and vision
            </h2>
            <p className="mt-4 text-[#3B4F43] leading-7">
              Building stronger communities through responsible food sharing and
              meaningful connections.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {MISSION_VISION.map((m) => (
              <div key={m.title} className="group bg-white rounded-3xl p-7 shadow-sm hover:shadow-lg motion-safe:transition">
                <span className={`w-14 h-14 rounded-full flex items-center justify-center ${m.ring}`}>
                  <Icon name={m.icon} className="w-6 h-6" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-[#0F2E22]">{m.title}</h3>
                <p className="mt-3 text-[#3B4F43] leading-7">{m.text}</p>
                <div
                  className={`mt-6 h-1 w-14 rounded-full ${m.bar} motion-safe:transition-all motion-safe:duration-300 group-hover:w-24`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VALUES (গাঢ় সবুজ ব্যান্ড) ============ */}
      <section className="bg-[#0F2E22]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <Eyebrow dark>Our core values</Eyebrow>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              What we <span className="text-[#F2B01E]">believe in</span>
            </h2>
            <p className="mt-4 text-[#DCE9E0] leading-7">
              Our values guide the way we approach food sharing and community support.
            </p>
          </div>

          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white/[0.07] border border-white/10 p-5">
                <span className="w-12 h-12 rounded-full bg-[#F2B01E] text-[#0F2E22] flex items-center justify-center">
                  <Icon name={v.icon} className="w-5 h-5" />
                </span>
                <h3 className="mt-4 font-semibold text-white">{v.title}</h3>
                <p className="mt-1.5 text-sm text-[#A9BFB0] leading-6">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#0F2E22]">
          How <Highlight>FoodShare</Highlight> helps
        </h2>
        <p className="mt-4 text-[#3B4F43] max-w-xl leading-7">
          Designed to make food sharing easier, more organized and more accessible.
        </p>

        <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md motion-safe:transition">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-full bg-[#FFE9A8] text-[#8A5A00] flex items-center justify-center">
                  <Icon name={s.icon} className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold text-[#9A6B00] tabular-nums">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-[#3B4F43] leading-6">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ NGO পার্টনার (আসল ডেটা, না থাকলে লুকানো) ============ */}
      {approvedNgos.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F2E22]">
            Our <Highlight>NGO partners</Highlight>
          </h2>

          <ul className="mt-7 flex flex-wrap gap-3">
            {approvedNgos.map((ngo) => (
              <li
                key={ngo.id}
                className="flex items-center gap-3 bg-white rounded-full pl-2 pr-5 py-2 shadow-sm border border-[#0F2E22]/10"
              >
                {ngo.image ? (
                  <img src={ngo.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <span className="w-9 h-9 rounded-full bg-[#ECE4C8]" aria-hidden="true" />
                )}
                <span className="font-medium text-sm">{ngo.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============ EVENTS ============ */}
      {EVENTS.length > 0 && (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F2E22]">
              Our <Highlight>events</Highlight>
            </h2>
            <p className="mt-4 text-[#3B4F43]">Moments from the field.</p>

            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {EVENTS.map((e, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden group h-[260px] shadow-md">
                  <img
                    src={e.img}
                    alt={e.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 motion-safe:transition motion-safe:duration-500"
                  />
                  <div className="absolute inset-0 bg-[#0F2E22]/55 flex flex-col items-center justify-center text-center p-6">
                    <h3 className="text-white font-bold text-lg leading-snug">{e.title}</h3>
                    {e.date && <p className="mt-1 text-sm text-[#F2B01E]">{e.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TEAM ============ */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F2E22]">
          The <Highlight>team</Highlight> behind it
        </h2>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm">
              <Photo src={m.img} alt={m.name} className="w-full h-44 rounded-xl" />
              <div className="px-1 pt-3 pb-1">
                <p className="font-semibold">{m.name || "Name"}</p>
                <p className="text-sm text-[#3B4F43]">{m.role || "Role"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ COMMUNITY (কোলাজসহ) ============ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow>Our community</Eyebrow>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight text-[#0F2E22]">
              Together, we can <Highlight>make a difference.</Highlight>
            </h2>

            <p className="mt-5 text-[#3B4F43] leading-7 max-w-lg">
              FoodShare brings together people who believe in helping others and
              reducing unnecessary food waste. Whether you're an individual, a
              restaurant, a business or an NGO, you can be part of our mission.
            </p>

            <ul className="mt-6 space-y-3">
              {COMMUNITY_POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-[#F2B01E] text-[#0F2E22] flex items-center justify-center">
                    <Icon name="check" className="w-4 h-4" />
                  </span>
                  <span className="font-medium text-[#14231B]">{p}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className={`inline-flex items-center gap-2 mt-8 px-7 py-3 rounded-full bg-[#0F2E22] text-white font-semibold hover:bg-[#184230] transition shadow-lg shadow-[#0F2E22]/20 ${focus}`}
            >
              Join FoodShare
              <Icon name="arrow" className="w-4 h-4" />
            </Link>
          </div>

          {/* কোলাজ */}
          <div className="relative h-[380px] max-w-md mx-auto lg:max-w-none w-full">
            <span className="absolute -top-3 left-6 w-20 h-20 rounded-full bg-[#F2B01E]" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600"
              alt="Kids eating"
              className="absolute top-0 right-0 w-[55%] h-[55%] object-cover rounded-2xl shadow-lg z-10"
            />
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600"
              alt="Volunteer"
              className="absolute top-[38%] left-0 w-[55%] h-[55%] object-cover rounded-2xl shadow-lg z-20"
            />
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600"
              alt="Community meal"
              className="absolute bottom-0 right-[8%] w-[48%] h-[45%] object-cover rounded-2xl shadow-lg z-30"
            />
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0F2E22] px-6 md:px-10 py-10">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F2E22]/85" aria-hidden="true" />

          <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-6 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#F2B01E]">Be part of the change</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">Got food, or time to give?</h2>
              <p className="mt-3 text-sm md:text-base text-[#DCE9E0] leading-7 max-w-lg">
                Your small contribution can make a meaningful difference. Join
                FoodShare and help build a community where good food is shared
                instead of wasted.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/register"
                className="inline-flex items-center px-7 py-3 rounded-full bg-[#F2B01E] text-[#0F2E22] font-semibold hover:bg-[#FFC53D] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-7 py-3 rounded-full border-2 border-white/80 text-white font-semibold hover:bg-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;