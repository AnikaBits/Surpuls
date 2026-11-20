// src/pages/Contact.jsx
// আগের সব ফিচার রাখা হয়েছে (হিরো, তিনটা info কার্ড, community কার্ড, ফর্ম + demo notice, FAQ)।
// শুধু ডিজাইন বদলেছে: হলুদ + গাঢ় সবুজ থিম, ইমোজির বদলে আইকন।
// দরকার: components/LiveStats.jsx (Icon এক্সপোর্ট)

import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Icon } from "../components/LiveStats";

const FONT = { fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" };

// হলুদ হাইলাইট (Home/About-এর মতো)
function Highlight({ children }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute -inset-x-2 -inset-y-1 bg-[#F2B01E] -rotate-1 rounded-full z-0" aria-hidden="true" />
    </span>
  );
}

const INFO_CARDS = [
  {
    icon: "mail",
    title: "Email Support",
    text: "For email inquiries, please use the official contact details provided by the FoodShare team.",
    ring: "bg-[#FFE9A8] text-[#8A5A00]",
  },
  {
    icon: "pin",
    title: "Our Community",
    text: "FoodShare connects food donors and NGOs through a shared platform.",
    ring: "bg-[#DDF2E2] text-[#2F7A55]",
  },
  {
    icon: "handshake",
    title: "Partnership Opportunities",
    text: "Interested in joining as a donor, restaurant, business or NGO? We'd love to work together.",
    ring: "bg-[#FFE0D8] text-[#D2542F]",
  },
];

const FAQS = [
  {
    icon: "bowl",
    q: "How can I donate food?",
    a: "Register as a donor, access your dashboard and follow the available steps to share surplus food.",
  },
  {
    icon: "handshake",
    q: "How can an NGO join FoodShare?",
    a: "Choose NGO / Volunteer during registration. Your account may require approval before accessing NGO features.",
  },
  {
    icon: "shield",
    q: "What is FoodShare's mission?",
    a: "FoodShare aims to reduce food waste by connecting surplus food donors with organizations that can help distribute food to people in need.",
  },
  {
    icon: "users",
    q: "Who can become a food donor?",
    a: "Individuals, restaurants and businesses can select their donor type during registration.",
  },
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [notice, setNotice] = useState("");

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (notice) {
      setNotice("");
    }
  }

  // Demo form submission
  function handleSubmit(e) {
    e.preventDefault();

    setNotice("This contact form is currently a demo. Your message has not been sent yet.");
  }

  const inputStyle =
    "w-full px-4 py-3.5 bg-[#F6F7F2] border border-[#0F2E22]/15 rounded-xl text-sm text-[#14231B] placeholder:text-[#3B4F43]/50 outline-none focus:bg-white focus:border-[#F2B01E] focus:ring-2 focus:ring-[#F2B01E] transition";

  const labelStyle = "block text-sm font-medium text-[#0F2E22] mb-1.5";

  const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F2E22]";

  return (
    <div className="min-h-screen bg-[#F6F7F2] text-[#14231B] overflow-x-hidden" style={FONT}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&display=swap');`}</style>

      {/* NAVBAR */}
      <Navbar />

      {/* ============ HERO SECTION ============ */}
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F2E22] px-6 py-7 md:px-10 md:py-9">
          <span className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />
          <span className="absolute -bottom-14 right-24 w-40 h-40 rounded-full bg-[#F2B01E]/20" aria-hidden="true" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#F6D98A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2B01E]" aria-hidden="true" />
                We're here to help
              </span>

              {/* Heading */}
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
                Let's get <Highlight><span className="text-[#0F2E22]">in touch.</span></Highlight>
              </h1>

              {/* Description */}
              <p className="mt-4 text-sm sm:text-base text-[#DCE9E0] leading-7">
                Have a question, suggestion or idea? We'd love to hear from you.
                Connect with FoodShare and help us build a community where good
                food never goes to waste.
              </p>
            </div>

            {/* Back Home */}
            <Link
              to="/"
              className="shrink-0 inline-flex items-center gap-2 self-start md:self-center px-5 py-2.5 rounded-full border-2 border-white/70 text-sm text-white font-semibold hover:bg-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Icon name="arrow" className="w-4 h-4 rotate-180" />
              Back to homepage
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONTACT SECTION ============ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-[#FFE9A8] px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#8A5A00]">
              Contact FoodShare
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#0F2E22]">
              We'd love to <Highlight>hear from you</Highlight>
            </h2>

            <p className="mt-5 text-[#3B4F43] max-w-2xl mx-auto leading-7">
              Whether you're a donor, an NGO or someone who wants to support our
              mission, we're happy to connect.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* LEFT SIDE - CONTACT INFORMATION */}
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-[#0F2E22]">Contact information</h3>
                <p className="mt-2 text-[#3B4F43] leading-7">
                  FoodShare is working to connect people, reduce food waste and
                  support communities.
                </p>
              </div>

              {INFO_CARDS.map((c) => (
                <div
                  key={c.title}
                  className="bg-white border border-[#0F2E22]/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 motion-safe:transition"
                >
                  <div className="flex items-start gap-4">
                    <span className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${c.ring}`}>
                      <Icon name={c.icon} className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-semibold text-[#0F2E22]">{c.title}</h4>
                      <p className="mt-1 text-sm text-[#3B4F43] leading-6">{c.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Community Card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#0F2E22] p-5 text-white shadow-lg">
                <span className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#F2B01E]/25" aria-hidden="true" />

                <div className="relative flex items-start gap-4">
                  <span className="w-11 h-11 shrink-0 rounded-full bg-[#F2B01E] text-[#0F2E22] flex items-center justify-center">
                    <Icon name="users" className="w-5 h-5" />
                  </span>

                  <div>
                    <h3 className="text-lg font-bold">Be part of something good</h3>

                    <p className="mt-1 text-sm text-[#DCE9E0] leading-6">
                      Join our growing community and help turn surplus food into hope.
                    </p>

                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-[#F2B01E] text-sm text-[#0F2E22] font-semibold hover:bg-[#FFC53D] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Join FoodShare
                      <Icon name="arrow" className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - CONTACT FORM */}
            <div className="lg:col-span-3">
              <div className="relative">
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl bg-[#F2B01E]" aria-hidden="true" />

                <div className="relative bg-white border border-[#0F2E22]/10 rounded-3xl p-6 sm:p-9 shadow-xl">
                  {/* Form Header */}
                  <div className="mb-7">
                    <span className="w-12 h-12 rounded-full bg-[#0F2E22] text-[#F2B01E] flex items-center justify-center">
                      <Icon name="mail" className="w-5 h-5" />
                    </span>

                    <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-[#0F2E22]">Send us a message</h3>

                    <p className="mt-2 text-[#3B4F43] leading-7">
                      Fill out the form below to preview the contact experience.
                    </p>
                  </div>

                  {/* Demo Notice */}
                  {notice && (
                    <div
                      role="status"
                      className="mb-6 flex items-start gap-2.5 bg-[#FFF1CC] border border-[#F2B01E] text-[#5A4300] px-4 py-3.5 rounded-xl text-sm leading-6"
                    >
                      <Icon name="clock" className="w-4 h-4 mt-1 shrink-0" />
                      {notice}
                    </div>
                  )}

                  {/* Contact Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className={labelStyle}>
                          Full name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={handleChange}
                          autoComplete="name"
                          required
                          className={inputStyle}
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className={labelStyle}>
                          Email address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          placeholder="Your email address"
                          value={form.email}
                          onChange={handleChange}
                          autoComplete="email"
                          required
                          className={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="contact-subject" className={labelStyle}>
                        Subject
                      </label>

                      <select
                        id="contact-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className={inputStyle}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="donation">Food Donation</option>
                        <option value="ngo">NGO Partnership</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feedback & Suggestions</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className={labelStyle}>
                        Your message
                      </label>

                      <textarea
                        id="contact-message"
                        name="message"
                        placeholder="Write your message here..."
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        required
                        className={`${inputStyle} resize-none`}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F2E22] py-3.5 font-semibold text-white shadow-lg shadow-[#0F2E22]/20 hover:bg-[#184230] transition ${focus}`}
                    >
                      Preview message submission
                      <Icon name="arrow" className="w-4 h-4" />
                    </button>

                    {/* Privacy Note */}
                    <p className="text-center text-xs text-[#3B4F43] leading-6">
                      This is a demo form. Messages are not sent or saved yet.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="bg-[#FFF6DB] py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-10">
            <span className="inline-block rounded-full bg-white border border-[#F2B01E] px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#8A5A00]">
              Frequently asked questions
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#0F2E22]">
              How can <Highlight>we help?</Highlight>
            </h2>

            <p className="mt-5 text-[#3B4F43]">Here are some common questions about FoodShare.</p>
          </div>

          {/* FAQ Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="bg-white p-6 rounded-2xl border border-[#0F2E22]/10 shadow-sm hover:shadow-md motion-safe:transition"
              >
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 shrink-0 rounded-full bg-[#0F2E22] text-[#F2B01E] flex items-center justify-center">
                    <Icon name={f.icon} className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#0F2E22]">{f.q}</h3>
                    <p className="mt-2 text-sm text-[#3B4F43] leading-6">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Contact;