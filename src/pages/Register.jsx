// src/pages/Register.jsx
// তোমার সর্বশেষ কোডের সব লজিক রাখা হয়েছে (রেস্টুরেন্ট সার্চ, আলাদা পাসওয়ার্ড টগল,
// সফল হলে বাটন নিষ্ক্রিয়, টাইপ করলে error মুছে যাওয়া)। শুধু ডিজাইন বদলেছে।
// দরকার: components/AuthLayout.jsx, components/LiveStats.jsx (Icon), services/restaurantApi

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchRestaurantsByName } from "../services/restaurantApi";
import AuthLayout, { Field } from "../components/AuthLayout";
import { Icon } from "../components/LiveStats";

const ROLES = [
  { id: "donor", icon: "bowl", title: "Donor", text: "I have food to give" },
  { id: "ngo", icon: "handshake", title: "NGO / Volunteer", text: "I collect and deliver food" },
];

const DONOR_TYPES = [
  { id: "individual", label: "Individual" },
  { id: "restaurant", label: "Restaurant" },
  { id: "business", label: "Business" },
];

const PANEL_POINTS = [
  { icon: "bowl", title: "Share surplus food", text: "Help reduce food waste through donations." },
  { icon: "handshake", title: "Connect with NGOs", text: "Work together to support communities." },
  { icon: "star", title: "Make a difference", text: "Every small contribution creates impact." },
];

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "donor",
    donorType: "individual",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeSearching, setPlaceSearching] = useState(false);
  const [placeError, setPlaceError] = useState("");

  const isRestaurantDonor = form.role === "donor" && form.donorType === "restaurant";

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  // কার্ড/পিল বাটন দিয়ে role ও donorType বাছা (handleChange-এর মতোই কাজ করে)
  function choose(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError("");
    }
  }

  // Search the restaurant's real place on OpenStreetMap
  async function handlePlaceSearch() {
    if (!placeQuery.trim()) return;

    setPlaceSearching(true);
    setPlaceError("");
    setPlaceResults([]);

    try {
      const results = await searchRestaurantsByName(placeQuery);
      setPlaceResults(results);

      if (results.length === 0) {
        setPlaceError(
          "No matching place found. You can still register manually — the admin will verify your restaurant."
        );
      }
    } catch (err) {
      setPlaceError("Search failed. You can still register manually below.");
    } finally {
      setPlaceSearching(false);
    }
  }

  function handleSelectPlace(place) {
    setSelectedPlace(place);
    setForm((prev) => ({ ...prev, name: place.name }));
    setPlaceResults([]);
    setPlaceError("");
  }

  // Handle registration
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("সব ঘর পূরণ করুন।");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না।");
      return;
    }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      donorType: form.role === "donor" ? form.donorType : undefined,
      restaurantPlace: isRestaurantDonor && selectedPlace ? selectedPlace : undefined,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  const eyeButton = (visible, onToggle, label) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={visible}
      className="p-2 rounded-lg text-[#3B4F43] hover:bg-[#F2B01E]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2B01E]"
    >
      <Icon name={visible ? "eyeoff" : "eye"} className="w-[18px] h-[18px]" />
    </button>
  );

  return (
    <AuthLayout
      badge="Join our community"
      tagline="Share food. Spread hope."
      heading="Create account"
      subheading="Start your journey with FoodShare and make a positive impact today."
      panelHeading="Be the reason someone smiles."
      panelText="Join FoodShare and become part of a community dedicated to reducing food waste and helping people in need. Together, we can turn surplus food into hope."
      points={PANEL_POINTS}
      bottomText="Together, let's create a world with less waste."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#0F2E22] underline underline-offset-4 decoration-2 decoration-[#F2B01E] hover:decoration-[#0F2E22]"
          >
            Login here
          </Link>
        </>
      }
    >
      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#E5322D]/30 bg-[#FFF0EE] px-4 py-3 text-sm text-[#B3231F]"
        >
          <Icon name="ban" className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#2F7A55]/30 bg-[#E6F6EA] px-4 py-3 text-sm text-[#1F5C45]"
        >
          <Icon name="check" className="w-4 h-4 mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Register As */}
        <fieldset>
          <legend className="block text-sm font-medium text-[#0F2E22] mb-1.5">Register as</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => {
              const selected = form.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => choose("role", r.id)}
                  aria-pressed={selected}
                  className={`text-left rounded-2xl border-2 p-3.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2E22] ${
                    selected
                      ? "border-[#F2B01E] bg-[#FFF6DB]"
                      : "border-[#0F2E22]/15 bg-white hover:border-[#F2B01E]/60"
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      selected ? "bg-[#0F2E22] text-[#F2B01E]" : "bg-[#ECE4C8] text-[#5A4300]"
                    }`}
                  >
                    <Icon name={r.icon} className="w-[18px] h-[18px]" />
                  </span>
                  <span className="mt-2 block font-semibold text-sm text-[#0F2E22]">{r.title}</span>
                  <span className="block text-xs text-[#3B4F43]">{r.text}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Donor Type - Only for Donor */}
        {form.role === "donor" && (
          <fieldset>
            <legend className="block text-sm font-medium text-[#0F2E22] mb-1.5">Donor type</legend>
            <div className="flex flex-wrap gap-2">
              {DONOR_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => choose("donorType", t.id)}
                  aria-pressed={form.donorType === t.id}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2E22] ${
                    form.donorType === t.id
                      ? "bg-[#0F2E22] text-white"
                      : "bg-white border border-[#0F2E22]/20 text-[#3B4F43] hover:bg-[#FFF6DB]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* Find Restaurant - Only for Restaurant Donors */}
        {isRestaurantDonor && (
          <div className="rounded-2xl border border-[#F2B01E]/60 bg-[#FFF6DB] p-5 space-y-4">
            <div>
              <label
                htmlFor="register-place-search"
                className="flex items-center gap-2 text-sm font-semibold text-[#0F2E22]"
              >
                <Icon name="pin" className="w-4 h-4 text-[#8A5A00]" />
                Find your restaurant on the map
              </label>
              <p className="mt-1 text-xs text-[#5A4300] leading-5">
                Search your restaurant's real name and select it. This helps the
                admin verify your restaurant faster.
              </p>
            </div>

            {selectedPlace ? (
              <div className="bg-white border-2 border-[#2F7A55] rounded-xl p-4">
                <p className="flex items-center gap-2 font-semibold text-[#0F2E22]">
                  <Icon name="check" className="w-4 h-4 text-[#2F7A55] shrink-0" />
                  {selectedPlace.name}
                </p>

                <p className="text-xs text-[#3B4F43] mt-1 leading-5">{selectedPlace.address}</p>

                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="mt-3 text-xs font-semibold text-[#C42A26] hover:text-[#8F1D1A] transition"
                >
                  Remove, search again
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    id="register-place-search"
                    type="text"
                    value={placeQuery}
                    onChange={(e) => setPlaceQuery(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter চাপলে ফর্ম সাবমিট না হয়ে সার্চ চলবে
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handlePlaceSearch();
                      }
                    }}
                    placeholder="Your restaurant's name"
                    className="w-full rounded-xl border border-[#0F2E22]/20 bg-white px-4 py-2.5 text-sm text-[#14231B] placeholder:text-[#3B4F43]/50 focus:outline-none focus:ring-2 focus:ring-[#F2B01E] focus:border-[#F2B01E]"
                  />

                  <button
                    type="button"
                    onClick={handlePlaceSearch}
                    disabled={placeSearching}
                    className="shrink-0 inline-flex items-center gap-1.5 px-5 rounded-xl bg-[#0F2E22] text-sm font-semibold text-white hover:bg-[#184230] transition disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2E22]"
                  >
                    <Icon name="search" className="w-4 h-4" />
                    {placeSearching ? "Searching..." : "Search"}
                  </button>
                </div>

                {placeError && <p className="text-xs text-[#5A4300] leading-5">{placeError}</p>}

                {placeResults.length > 0 && (
                  <div className="space-y-2">
                    {placeResults.map((place) => (
                      <button
                        key={place.osmId}
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className="w-full text-left bg-white border border-[#0F2E22]/15 rounded-xl px-4 py-3 hover:border-[#F2B01E] hover:shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2B01E]"
                      >
                        <p className="font-semibold text-[#14231B] text-sm">{place.name}</p>
                        <p className="text-xs text-[#3B4F43] mt-0.5 leading-5">{place.address}</p>
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-[#5A4300]/80 leading-5">
                  Not on the map? No problem. Complete the form normally and the
                  admin will verify you manually.
                </p>
              </>
            )}
          </div>
        )}

        {/* Full Name */}
        <Field
          label="Full name"
          id="register-name"
          icon="user"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        {/* Email */}
        <Field
          label="Email address"
          id="register-email"
          icon="mail"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        {/* Password */}
        <Field
          label="Password"
          id="register-password"
          icon="lock"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          right={eyeButton(
            showPassword,
            () => setShowPassword(!showPassword),
            showPassword ? "Hide password" : "Show password"
          )}
        />

        {/* Confirm Password */}
        <Field
          label="Confirm password"
          id="register-confirm-password"
          icon="lock"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
          right={eyeButton(
            showConfirmPassword,
            () => setShowConfirmPassword(!showConfirmPassword),
            showConfirmPassword ? "Hide confirm password" : "Show confirm password"
          )}
        />

        {/* Register Button */}
        <button
          type="submit"
          disabled={Boolean(success)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F2E22] py-3.5 font-semibold text-white shadow-lg shadow-[#0F2E22]/20 hover:bg-[#184230] transition disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2E22]"
        >
          Create FoodShare account
          <Icon name="arrow" className="w-4 h-4" />
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;