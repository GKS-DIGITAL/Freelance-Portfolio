"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Code2,
  ExternalLink,
  Facebook,
  Globe2,
  Instagram,
  Layers3,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import Logo from "../components/Logo";
import Reveal from "../components/Reveal";
import SectionTitle from "../components/SectionTitle";
import { buildWhatsAppUrl, validateContactPayload } from "../lib/contact";

const services = [
  "Business Websites",
  "Landing Pages",
  "Website Redesign",
  "Website Maintenance",
  "Website Speed Optimization",
  "Domain & Hosting Setup",
];
const perks = [
  [
    Sparkles,
    "Modern Design",
    "Clear, memorable visual systems that make your business feel established.",
  ],
  [
    Zap,
    "Lightning Fast",
    "Lightweight builds engineered for a sharp first impression.",
  ],
  [
    Search,
    "SEO Ready",
    "A technical foundation that helps customers find you locally.",
  ],
  [
    MessageCircle,
    "WhatsApp Integration",
    "Turn high-intent website visits into instant conversations.",
  ],
  [
    MonitorSmartphone,
    "Responsive",
    "A flawless experience on the devices your customers use most.",
  ],
  [
    ShieldCheck,
    "Easy Maintenance",
    "A clean handover and support that keeps you confidently in control.",
  ],
];
const projects = [
  {
    title: "Bella Vista",
    type: "Restaurant Website",
    desc: "A premium fine-dining experience designed to turn curiosity into reservations.",
    image: "/portfolio/bella-vista-restaurant.png",
    url: "https://restaurant-demo-zeta-mocha.vercel.app/",
  },
  {
    title: "Luxe Studio",
    type: "Salon Website",
    desc: "A luxury beauty experience with an elegant, appointment-focused digital presence.",
    image: "/portfolio/luxe-salon.png",
    url: "https://salon-demo-tawny.vercel.app/",
  },
  {
    title: "Iron Forge",
    type: "Gym Website",
    desc: "A bold fitness site built to drive membership interest and inspire action.",
    image: "/portfolio/iron-forge-gym.png",
    url: "https://gym-demo-ebon-rho.vercel.app/",
  },
  {
    title: "Skyline",
    type: "Real Estate Website",
    desc: "A refined property showcase designed to generate high-quality enquiries.",
    image: "/portfolio/skyline-real-estate.png",
    url: "https://real-estate-demo-teal.vercel.app/",
  },
];
const faqs = [
  [
    "How long does a website take?",
    "Most focused business websites are ready to launch in 2–4 weeks, depending on the project scope and how quickly we receive content and feedback.",
  ],
  [
    "Can I redesign my current website?",
    "Absolutely. We can retain what works, solve what does not, and give your brand a sharper online presence.",
  ],
  [
    "Do you provide hosting?",
    "Yes. We can set up secure hosting, your domain and everything needed for a smooth launch.",
  ],
  [
    "Will my website work on mobile?",
    "Always. Every GKS Digital site is designed mobile-first and rigorously tested across modern devices.",
  ],
  [
    "Can I update my website later?",
    "Yes. We build intuitive systems and offer maintenance support when you would rather stay focused on your business.",
  ],
];

function Button({ children, href = "#contact", secondary = false }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition duration-300 ${secondary ? "border border-slate-200 bg-white text-ink hover:border-blue-200 hover:bg-blue-50" : "bg-sky text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:bg-blue-700"}`}
    >
      {children}
      <ArrowRight size={16} />
    </a>
  );
}
const initialFormState = {
  name: "",
  phone: "",
  email: "",
  business: "",
  message: "",
};

function ContactForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const focusFirstInvalidInput = (fieldErrors) => {
    const orderedFields = ["name", "phone", "email", "business", "message"];
    const firstField = orderedFields.find((field) => fieldErrors[field]);
    if (!firstField) return;
    const input = document.querySelector(`[name="${firstField}"]`);
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "loading" || status === "success") {
      return;
    }

    const { sanitized, errors: validationErrors } = validateContactPayload(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("error");
      focusFirstInvalidInput(validationErrors);
      showToast("error", "Please complete the required fields.");
      return;
    }

    setStatus("loading");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitized),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      showToast("success", "✅ Inquiry sent successfully. Opening WhatsApp...");
      setStatus("success");

      const whatsappUrl = buildWhatsAppUrl(
        process.env.NEXT_PUBLIC_WHATSAPP || "919372036702",
        sanitized
      );
      const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!whatsappWindow) {
        window.location.href = whatsappUrl;
      }

      window.setTimeout(() => {
        resetForm();
        setStatus("idle");
      }, 1000);
    } catch (error) {
      setStatus("error");
      showToast("error", error.message || "❌ Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
          >
            <p className="text-sm font-semibold">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl bg-white p-5 text-ink sm:grid-cols-2 sm:p-7"
      >
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Your full name"
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="Your phone number"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Input
          label="Business Name"
          name="business"
          value={formData.business}
          onChange={handleChange}
          error={errors.business}
          placeholder="Your business name"
        />
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-bold">Message</span>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="What would you like your website to do?"
            className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-sky focus:ring-4 focus:ring-blue-100 ${errors.message ? "border-rose-300" : "border-slate-200"}`}
          />
          {errors.message && <p className="mt-2 text-sm text-rose-600">{errors.message}</p>}
        </label>
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-sky/70 sm:col-span-2"
        >
          {status === "loading" && <Loader2 size={16} className="animate-spin" />}
          {status === "loading"
            ? "Sending..."
            : status === "success"
              ? "Opening WhatsApp..."
              : "Request Free Consultation"}
          {status === "idle" && <ArrowRight size={16} />}
        </button>
      </form>
    </>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-slate-50/75 backdrop-blur-xl">
      <nav className="section flex h-[70px] items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-6 lg:flex">
          {[
            "Home",
            "Services",
            "Portfolio",
            "Process",
            "Pricing",
            "Contact",
          ].map((x) => (
            <a key={x} className="nav-link" href={`#${x.toLowerCase()}`}>
              {x}
            </a>
          ))}
        </div>
        <div className="hidden sm:block">
          <Button>Free Consultation</Button>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white sm:hidden"
          >
            <div className="section flex flex-col py-4">
              {[
                "Home",
                "Services",
                "Portfolio",
                "Process",
                "Pricing",
                "Contact",
              ].map((x) => (
                <a
                  onClick={() => setOpen(false)}
                  key={x}
                  className="py-3 font-semibold text-slate-700"
                  href={`#${x.toLowerCase()}`}
                >
                  {x}
                </a>
              ))}
              <Button>Free Consultation</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
function Stat({ value, label }) {
  const [num, setNum] = useState(0);
  useEffect(() => {
    let n = 0;
    const target = parseInt(value);
    const t = setInterval(() => {
      n += Math.ceil(target / 26);
      if (n >= target) {
        n = target;
        clearInterval(t);
      }
      setNum(n);
    }, 35);
    return () => clearInterval(t);
  }, [value]);
  return (
    <div>
      <p className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {num}
        {value.includes("+") ? "+" : value.includes("%") ? "%" : ""}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
function Mockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, rotate: 3 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.85, delay: 0.2 }}
      className="relative mx-auto max-w-[540px]"
    >
      <div className="absolute -inset-8 rounded-full bg-cyan/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[1.4rem] border-[7px] border-slate-800 bg-white shadow-2xl shadow-blue-950/25">
        <div className="flex h-7 items-center gap-1.5 bg-slate-800 px-3">
          <i className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <i className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
          <i className="h-1.5 w-1.5 rounded-full bg-green-400" />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <b className="font-serif text-xl">Terra</b>
            <span className="text-[8px] uppercase tracking-widest">
              Menu · Book
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-100 p-4">
              <p className="font-serif text-xl leading-none">
                Gather
                <br />
                well.
              </p>
              <p className="mt-7 text-[7px]">Seasonal. Local. Honest.</p>
            </div>
            <div className="h-32 rounded-xl bg-[url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=70')] bg-cover" />
          </div>
          <div className="mt-3 flex gap-2">
            <div className="h-12 flex-1 rounded-lg bg-slate-100" />
            <div className="h-12 flex-1 rounded-lg bg-slate-100" />
            <div className="h-12 flex-1 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-7 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-green-100 text-green-600">
            <BarChart3 size={16} />
          </span>
          <span>
            <b className="block text-sm">+42%</b>
            <small className="text-[10px] text-slate-500">more enquiries</small>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
export default function Home() {
  const [top, setTop] = useState(false);
  useEffect(() => {
    const f = () => setTop(scrollY > 600);
    addEventListener("scroll", f);
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <Navbar />
      <main id="home">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 to-slate-50 py-16 sm:py-24 lg:py-32">
          <div className="grid-noise absolute inset-0 opacity-60" />
          <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="section relative grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="eyebrow"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                Digital partner for local businesses
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl text-4xl font-extrabold leading-[1.07] text-ink sm:text-6xl lg:text-7xl"
              >
                Helping{" "}
                <span className="text-sky">local businesses Build Trust</span> & Get More Customers Online.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
              >
                We design fast, mobile-friendly websites for restaurants, salons, gyms, real estate businesses, 
                and other local brands that want to grow
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button href="#portfolio">View Our Work</Button>
                <Button secondary>Book Free Consultation</Button>
              </motion.div>
              <p className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Check size={16} className="text-sky" />
                No pressure. Just a practical growth conversation.
              </p>
            </div>
            <Mockup />
          </div>
        </section>
        <section className="border-y border-slate-200 bg-white">
          <div className="section grid grid-cols-2 gap-y-8 py-10 text-center sm:grid-cols-4 sm:text-left">
            <Stat value="50+" label="Projects delivered" />
            <Stat value="100%" label="Mobile responsive" />
            <Stat value="7" label="Day avg. first draft" />
            <Stat value="24" label="Hour response time" />
          </div>
        </section>
        <section className="section py-20 sm:py-28">
          <SectionTitle
            label="Why GKS Digital"
            title="Built to make a great first impression."
            text="A thoughtful digital presence does more than look good. It helps the right people choose you."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map(([Icon, title, desc], i) => (
              <Reveal delay={i * 0.05} key={title}>
                <div className="card group h-full p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-glow">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-sky transition group-hover:scale-110 group-hover:bg-sky group-hover:text-white">
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-2 leading-6 text-slate-600">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="services" className="bg-ink py-20 text-white sm:py-28">
          <div className="section">
            <SectionTitle
              label="What we do"
              title="Everything you need to show up with confidence."
              text="From a standout launch to keeping your site in peak form, we make the web side of your business feel simple."
              centered={false}
            />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal delay={i * 0.04} key={s}>
                  <div className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur transition hover:border-cyan/50 hover:bg-white/[.1]">
                    <span className="font-semibold">{s}</span>
                    <ArrowUpRight
                      className="text-cyan transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      size={19}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="portfolio" className="section py-20 sm:py-28">
          <SectionTitle
            label="Selected work"
            title="Digital experiences that feel like the business behind them."
            text="A glimpse at what happens when strategy, personality and clarity come together."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article className="card group overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={p.image}
                      alt={`${p.title} website preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="flex items-end justify-between gap-4 p-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.16em] text-sky">
                        {p.type}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold">{p.title}</h3>
                      <p className="mt-2 max-w-md leading-6 text-slate-600">
                        {p.desc}
                      </p>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open live demo for ${p.title}`}
                      className="mb-1 inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-bold text-sky transition hover:bg-sky hover:text-white"
                    >
                      <span className="hidden sm:inline">Live Demo</span>
                      <ExternalLink size={17} />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section
          id="process"
          className="border-y border-blue-100 bg-blue-50/60 py-20 sm:py-28"
        >
          <div className="section">
            <SectionTitle
              label="The process"
              title="Focused, collaborative and refreshingly clear."
            />
            <div className="grid gap-5 md:grid-cols-4">
              {[
                [
                  "01",
                  "Free Consultation",
                  "We listen, understand your goals and map the right next step.",
                ],
                [
                  "02",
                  "Design",
                  "We turn your positioning into a distinct visual direction.",
                ],
                [
                  "03",
                  "Development",
                  "Your approved design becomes a fast, thoughtful website.",
                ],
                [
                  "04",
                  "Launch",
                  "We test, polish and help you go live with confidence.",
                ],
              ].map(([n, t, d], i) => (
                <Reveal delay={i * 0.1} key={n}>
                  <div className="relative">
                    <p className="text-5xl font-extrabold text-blue-200">{n}</p>
                    <div className="mt-4 h-1 w-12 rounded-full bg-cyan" />
                    <h3 className="mt-5 text-xl font-bold">{t}</h3>
                    <p className="mt-2 leading-6 text-slate-600">{d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="section py-20 sm:py-28">
          <SectionTitle
            label="Simple packages"
            title="The right starting point for where you are."
            text="Every project is tailored. These packages give you a clear sense of what is possible."
          />
          <div className="grid items-stretch gap-5 lg:grid-cols-3">
            {[
              [
                "Starter",
                "For a clear, confident first step online",
                "4,999",
                [
                  "Up to 1 custom page",
                  "Landing page design",
                  "Mobile-first design",
                  "Contact & WhatsApp setup",
                  "1 Month support after launch"
                ],
              ],
              [
                "Business",
                "Our most popular option for growing businesses",
                "7,999",
                [
                  "Up to 4 custom pages",
                  "Admin Panel",
                  "Custom conversion strategy",
                  "SEO essentials & analytics",
                  "Priority launch support",
                  "3 Months support after launch"
                ],
              ],
              [
                "Premium",
                "For brands ready to create a category-level presence",
                "14,999",
                [
                  "Bespoke multi-page experience",
                  "Advanced interactions",
                  "Content & SEO strategy",
                  "Ongoing growth support",
                  "6 Months support after launch"
                ],
              ],
            ].map(([n, d, price , fs], i) => (
              <Reveal delay={i * 0.08} key={n}>
                <div
                  className={`card relative h-full p-7 ${i === 1 ? "border-sky bg-gradient-to-b from-blue-50 to-white shadow-glow" : " "}`}
                >
                  {i === 1 && (
                    <span className="absolute -top-3 left-6 rounded-full bg-sky px-3 py-1 text-xs font-bold text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{n}</h3>
                  <p className="mt-2 min-h-12 text-slate-600">{d}</p>
                  <p className="mt-6 text-lg font-bold text-ink">
                    Starting from <span className="text-sky">₹{price}</span>
                  </p>
                  <ul className="my-7 space-y-3">
                    {fs.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-slate-600">
                        <Check size={17} className="shrink-0 text-cyan" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button secondary>Start a project</Button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="bg-slate-100 py-20 sm:py-28">
          <div className="section">
            <SectionTitle
              label="Client notes"
              title="The kind of partnership people remember."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                [
                  "“GKS understood our business immediately. The new site has made us feel like the premium brand we always knew we were.”",
                  "Priya Shah",
                  "Miro Salon",
                ],
                [
                  "“We started getting better enquiries in the first week. The process was smooth, fast and incredibly well organised.”",
                  "Arjun Mehta",
                  "Forth Fitness",
                ],
                [
                  "“They brought real taste and strategic thinking to every conversation. We could not be happier with our launch.”",
                  "Nisha Kapoor",
                  "Casa & Co.",
                ],
              ].map(([q, n, b], i) => (
                <Reveal delay={i * 0.08} key={n}>
                  <div className="card h-full p-7">
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((x) => (
                        <Star key={x} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="mt-5 text-lg leading-7 text-slate-700">{q}</p>
                    <div className="mt-7 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky to-cyan font-bold text-white">
                        {n[0]}
                      </span>
                      <p>
                        <b className="block text-sm">{n}</b>
                        <span className="text-sm text-slate-500">{b}</span>
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="section py-20 sm:py-28">
          <SectionTitle label="FAQs" title="A few good questions." />
          <div className="mx-auto max-w-3xl">
            {faqs.map(([q, a]) => (
              <Faq key={q} q={q} a={a} />
            ))}
          </div>
        </section>
        <section id="contact" className="section pb-20 sm:pb-28">
          <div className="overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
            <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
              <div>
                <span className="eyebrow !border-white/15 !bg-white/10 !text-cyan-200">
                  Let’s build something good
                </span>
                <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                  Your next customer is already looking.
                </h2>
                <p className="mt-5 max-w-md leading-7 text-slate-300">
                  Tell us about your business. We will get back within one
                  business day with a useful next step.
                </p>
                <div className="mt-9 space-y-4 text-sm">
                  <a
                    href="https://wa.me/919372036702"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-slate-200 hover:text-white"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <MessageCircle size={17} />
                    </span>
                    Chat on WhatsApp
                  </a>
                  <a
                    href="tel:+919372036702"
                    className="flex items-center gap-3 text-slate-200 hover:text-white"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <Phone size={17} />
                    </span>
                    Schedule a quick call
                  </a>
                  <a
                    href="mailto:guruuu2468@gmail.com"
                    className="flex items-center gap-3 text-slate-200 hover:text-white"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <Mail size={17} />
                    </span>
                    Send an email
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="section grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Premium websites for local businesses with something worth saying.
            </p>
          </div>
          <FooterList
            title="Explore"
            items={["Home", "Services", "Portfolio", "Process"]}
          />
          <FooterList title="Services" items={services.slice(0, 4)} />
          <div>
            <p className="text-sm font-bold">Stay connected</p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-sky"
              >
                <Instagram size={17} />
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-sky"
              >
                <Facebook size={17} />
              </a>
            </div>
          </div>
        </div>
        <div className="section mt-10 border-t border-slate-100 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} GKS Digital. Built with care for
          businesses that want to grow.
        </div>
      </footer>
      <a
        href="https://wa.me/919372036702"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={22} />
      </a>
      <AnimatePresence>
        {top && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-lg"
            aria-label="Back to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
const Input = ({ label, name, type = "text", value, onChange, error, placeholder }) => {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-sky focus:ring-4 focus:ring-blue-100 ${error ? "border-rose-300" : "border-slate-200"}`}
      />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </label>
  );
};
function Faq({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-5 py-5 text-left text-lg font-bold"
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp className="shrink-0 text-sky" />
        ) : (
          <ChevronDown className="shrink-0 text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pb-5 leading-7 text-slate-600"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
function FooterList({ title, items }) {
  return (
    <div>
      <p className="text-sm font-bold">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i}>
            <a
              href={`#${i.toLowerCase().replaceAll(" ", "-")}`}
              className="text-sm text-slate-500 hover:text-sky"
            >
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
