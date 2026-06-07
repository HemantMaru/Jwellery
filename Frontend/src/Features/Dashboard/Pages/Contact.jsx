import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { Helmet } from "react-helmet-async";

const contactCards = [
  {
    title: "Boutique",
    detail: "123 Luxury Avenue, Suite 4B, New York, NY 10001",
  },
  {
    title: "Phone",
    detail: "+1 (800) 123-4567",
  },
  {
    title: "Email",
    detail: "info@aurumjewels.com",
  },
  {
    title: "Hours",
    detail: "Mon - Sat, 10am - 7pm",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setSuccessMessage("");

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Full name is required.";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.message.trim()) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setFormData(initialForm);
      setSuccessMessage(
        "Your inquiry has been received. Our consultancy team will respond shortly.",
      );
      addToast("Message sent successfully.", "success");
    }, 900);
  };

  const renderFieldError = (field) => {
    if (!errors[field]) return null;
    return <p className="mt-2 text-xs text-[var(--color-danger)]">{errors[field]}</p>;
  };

  return (
    <div className="app-page pt-32">
      <Helmet>
        <title>Contact Us | AURUM Luxury Jewellery</title>
        <meta name="description" content="Get in touch with AURUM. Reach out for bespoke orders, product questions, or a private styling consultation." />
      </Helmet>
      <section className="section-shell pb-12 text-center">
        <p className="eyebrow mb-4">Contact</p>
        <h1 className="font-['Playfair_Display'] text-5xl font-bold md:text-6xl">
          Speak with Aurum
        </h1>
        <p className="text-muted mx-auto mt-5 max-w-2xl text-base md:text-lg leading-relaxed">
          Reach out for bespoke orders, product questions, or a private styling
          consultation.
        </p>
      </section>

      <section className="section-shell grid gap-10 pb-20 lg:grid-cols-[1fr_0.85fr]">
        <form onSubmit={handleSubmit} className="surface border p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
            Send an Inquiry
          </h2>
          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="premium-input"
                placeholder="Jane Doe"
              />
              {renderFieldError("name")}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="jane@example.com"
                />
                {renderFieldError("email")}
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted">
                Your Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="6"
                className="premium-input resize-none"
                placeholder="Tell us about the piece, occasion, or consultation you have in mind."
              />
              {renderFieldError("message")}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="premium-button w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {successMessage && (
              <div className="border border-[var(--color-accent)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text)]">
                {successMessage}
              </div>
            )}
          </div>
        </form>

        <aside className="space-y-6">
          <div className="surface-soft border border-[var(--color-border)] p-6 sm:p-8">
            <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
              Visit or message us
            </h2>
            <div className="mt-8 grid gap-5">
              {contactCards.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-[var(--color-border)] pb-5 last:border-0 last:pb-0"
                >
                  <p className="eyebrow mb-2">{item.title}</p>
                  <p className="text-muted leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const message =
                "Hi! I would like to inquire about your jewellery products.";
              window.open(
                `https://wa.me/917987550928?text=${encodeURIComponent(message)}`,
                "_blank",
              );
            }}
            className="flex w-full items-center justify-center bg-[#25D366] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#1eba5a]"
          >
            Message on WhatsApp
          </button>

          <div className="flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              Facebook
            </a>
            <a
              href="https://www.pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              Pinterest
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}
