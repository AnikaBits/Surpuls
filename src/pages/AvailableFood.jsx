// src/pages/AvailableFood.jsx
// নতুন ডিজাইন (হলুদ + গাঢ় সবুজ)। লজিক আগের মতোই:
// location filter, শুধু "available" খাবার, Request চাপলে NGO না হলে /login, NGO হলে /ngo/dashboard।
// নতুন: প্রতিটা কার্ডে expiry countdown চিপ (Safe / Urgent / Critical / Expired)।
// দরকার: components/LiveStats.jsx (Icon), utils/time.js

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { Icon } from "../components/LiveStats";
import { msRemaining, urgencyLevel, formatRemaining } from "../utils/time";

const FONT = { fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" };

// প্রতি সেকেন্ডে সময় বদলায়, যাতে countdown চলে
function useNow(interval = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

function Highlight({ children }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute -inset-x-2 -inset-y-1 bg-[#F2B01E] -rotate-1 rounded-full z-0" aria-hidden="true" />
    </span>
  );
}

// urgency অনুযায়ী চিপের রঙ
const CHIP_STYLE = {
  safe: { box: "bg-[#DDF2E2] text-[#1F6B45]", dot: "bg-[#2F7A55]", label: "Safe" },
  urgent: { box: "bg-[#FFE9A8] text-[#6B4700]", dot: "bg-[#E0A21B]", label: "Urgent" },
  critical: { box: "bg-[#FFE0D8] text-[#A8281F]", dot: "bg-[#E5322D]", label: "Critical" },
  expired: { box: "bg-[#E7E7E2] text-[#55584F]", dot: "bg-[#8A8F8A]", label: "Expired" },
};

function ExpiryChip({ donation, now }) {
  const ms = msRemaining(donation, now);
  const level = urgencyLevel(ms);
  const style = CHIP_STYLE[level];
  if (!style) return null; // expiry জানা না থাকলে কিছু দেখাবে না

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${style.box}`}
      title={style.label}
    >
      <span
        className={`w-2 h-2 rounded-full ${style.dot} ${level === "critical" ? "motion-safe:animate-pulse" : ""}`}
        aria-hidden="true"
      />
      <span className="tabular-nums">{level === "expired" ? "Expired" : formatRemaining(ms)}</span>
    </span>
  );
}

function AvailableFood() {
  const { currentUser, donations, users } = useAuth();
  const navigate = useNavigate();
  const [locationFilter, setLocationFilter] = useState("");
  const now = useNow();

  const availableFood = donations.filter(
    (d) =>
      d.status === "available" &&
      d.pickupLocation.toLowerCase().includes(locationFilter.toLowerCase())
  );

  function getDonorName(id) {
    const donor = users.find((u) => u.id === id);
    return donor ? donor.name : "Unknown Donor";
  }

  function handleRequestClick() {
    // Public visitor বা login না করা কেউ Request চাপলে Login পেজে পাঠানো হচ্ছে
    if (!currentUser || currentUser.role !== "ngo") {
      navigate("/login");
      return;
    }
    navigate("/ngo/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#14231B] overflow-x-hidden" style={FONT}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&display=swap');`}</style>

      <Navbar />

      {/* ============ হেডার ব্যানার + সার্চ ============ */}
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F2E22] px-6 py-8 md:px-10 md:py-9">
          <span className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />
          <span className="absolute -bottom-16 right-1/3 w-44 h-44 rounded-full bg-[#F2B01E]/20" aria-hidden="true" />

          <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-6 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#F6D98A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2B01E]" aria-hidden="true" />
                Ready to be rescued
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
                Available <Highlight><span className="text-[#0F2E22]">food</span></Highlight>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-[#DCE9E0] leading-7 max-w-lg">
                Browse surplus food currently available for pickup across the city.
              </p>
            </div>

            <div>
              <label htmlFor="location-filter" className="block text-sm font-medium text-[#DCE9E0] mb-1.5">
                Filter by location
              </label>
              <div className="relative">
                <Icon
                  name="search"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#3B4F43]/70 pointer-events-none"
                />
                <input
                  id="location-filter"
                  type="text"
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full rounded-full bg-white pl-11 pr-4 py-3.5 text-sm text-[#14231B] placeholder:text-[#3B4F43]/50 focus:outline-none focus:ring-2 focus:ring-[#F2B01E]"
                />
              </div>
              <p className="mt-2 text-xs text-[#A9BFB0] tabular-nums" aria-live="polite">
                {availableFood.length} {availableFood.length === 1 ? "listing" : "listings"} right now
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ কার্ডের তালিকা ============ */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {availableFood.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#0F2E22]/10 shadow-sm p-10 text-center max-w-xl mx-auto">
            <span className="mx-auto w-14 h-14 rounded-full bg-[#FFE9A8] text-[#8A5A00] flex items-center justify-center">
              <Icon name="bowl" className="w-6 h-6" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-[#0F2E22]">Nothing here right now</h2>
            <p className="mt-1 text-sm text-[#3B4F43]">No available food listings right now.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableFood.map((donation) => (
            <article
              key={donation.id}
              className="group bg-white rounded-2xl border border-[#0F2E22]/10 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 motion-safe:transition flex flex-col"
            >
              <div className="relative h-44 bg-[#ECE4C8] overflow-hidden">
                {donation.foodImage && (
                  <img
                    src={donation.foodImage}
                    alt={donation.foodItems[0]?.name}
                    className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-3 left-3">
                  <ExpiryChip donation={donation} now={now} />
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-semibold text-lg text-[#0F2E22] leading-snug">
                    {donation.foodItems[0]?.name}
                  </h3>
                  <StatusBadge status={donation.status} />
                </div>

                <ul className="mt-3 space-y-2 text-sm text-[#3B4F43]">
                  <li className="flex items-center gap-2.5">
                    <Icon name="user" className="w-4 h-4 shrink-0 text-[#8A5A00]" />
                    <span>
                      By <span className="font-medium text-[#14231B]">{getDonorName(donation.donorId)}</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Icon name="bowl" className="w-4 h-4 shrink-0 text-[#8A5A00]" />
                    <span>
                      Quantity: <span className="font-medium text-[#14231B]">{donation.totalQuantity}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Icon name="pin" className="w-4 h-4 mt-0.5 shrink-0 text-[#8A5A00]" />
                    <span>{donation.pickupLocation}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Icon name="clock" className="w-4 h-4 shrink-0 text-[#8A5A00]" />
                    <span>Until {donation.expiryTime}</span>
                  </li>
                </ul>

                <button
                  onClick={handleRequestClick}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F2E22] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0F2E22]/15 hover:bg-[#184230] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2E22]"
                >
                  Request food
                  <Icon name="arrow" className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AvailableFood;