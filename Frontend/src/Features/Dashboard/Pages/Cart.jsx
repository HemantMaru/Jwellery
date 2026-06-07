// import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";

// const quickActions = [
//   {
//     title: "WhatsApp",
//     copy: "Start a private chat with our consultancy team.",
//     href: `https://wa.me/917987550928?text=${encodeURIComponent(
//       "Hi! I would like to place a quick order with AURUM.",
//     )}`,
//     external: true,
//   },
//   {
//     title: "Call",
//     copy: "Speak directly with a jewellery specialist.",
//     href: "tel:+917987550928",
//   },
//   {
//     title: "Email",
//     copy: "Send your product name, size, and preferred delivery details.",
//     href: `mailto:info@aurumjewels.com?subject=${encodeURIComponent(
//       "AURUM quick order inquiry",
//     )}`,
//   },
// ];

// export default function Cart() {
//   const navigate = useNavigate();

//   return (
//     <div className="app-page pt-32 pb-20">
//       <Helmet>
//         <title>Quick Order | AURUM Luxury Jewellery</title>
//         <meta name="description" content="Place an order through guided consultation. Every size, finish, and delivery detail for your formal jewellery is confirmed with dedicated care." />
//       </Helmet>
//       <section className="section-shell text-center">
//         <p className="eyebrow mb-4">Quick Order</p>
//         <h1 className="mx-auto max-w-3xl font-['Playfair_Display'] text-5xl font-bold leading-tight md:text-6xl">
//           Personal ordering, without the ordinary cart
//         </h1>
//         <p className="text-muted mx-auto mt-5 max-w-2xl leading-relaxed md:text-lg">
//           AURUM purchases are handled through guided consultation so every size,
//           finish, and delivery detail is confirmed with care.
//         </p>
//       </section>

//       <section className="section-shell mt-12 grid gap-5 md:grid-cols-3">
//         {quickActions.map((action) => (
//           <a
//             key={action.title}
//             href={action.href}
//             target={action.external ? "_blank" : undefined}
//             rel={action.external ? "noreferrer" : undefined}
//             className="surface border p-7 text-center shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-hover)]"
//           >
//             <h2 className="font-['Playfair_Display'] text-3xl font-semibold">
//               {action.title}
//             </h2>
//             <p className="text-muted mt-4 leading-relaxed">{action.copy}</p>
//           </a>
//         ))}
//       </section>

//       <section className="section-shell mt-12 flex flex-col items-center gap-4 text-center">
//         <p className="text-muted max-w-2xl">
//           Prefer to choose a piece first? Open any product and use WhatsApp,
//           call, or email from the product details page.
//         </p>
//         <button
//           type="button"
//           onClick={() => navigate("/products")}
//           className="premium-button"
//         >
//           Explore Collection
//         </button>
//       </section>
//     </div>
//   );
// }
