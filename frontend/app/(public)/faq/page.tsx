import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'FAQ | KINGJOEBRIDD FASHION',
  description: 'Frequently Asked Questions about our bespoke tailoring services.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How does the bespoke tailoring process work?",
      answer: "Our bespoke process begins with a consultation where we discuss your style preferences, fabric choices, and take precise measurements. We then create a unique pattern just for you. This is followed by 1-3 fittings to ensure the garment drapes perfectly on your frame before final finishing."
    },
    {
      question: "How long does it take to make a bespoke suit?",
      answer: "A standard bespoke suit typically takes 4 to 6 weeks from the initial consultation to final delivery. Rush orders may be accommodated depending on our master tailors' availability, subject to an expedited service fee."
    },
    {
      question: "Do you provide fabrics or can I bring my own?",
      answer: "We source premium fabrics globally, offering an extensive selection of wools, silks, linens, and traditional African textiles. However, if you have a specific fabric you would like us to use (Customer Sourced), we are more than happy to tailor it for you."
    },
    {
      question: "Can I submit a style request online?",
      answer: "Yes! You can browse our Collections page and click 'I Want This' on any style, or submit a custom Style Request from your dashboard. You can upload reference images, and we will get back to you with a detailed quote."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship globally using premium courier services to ensure your bespoke garments arrive safely. Shipping costs and delivery times vary depending on the destination."
    },
    {
      question: "What is your alteration policy?",
      answer: "We guarantee the fit of our bespoke garments. Any minor alterations needed immediately after the final fitting are complimentary. For future alterations due to weight fluctuations, we offer an alteration service for a fee."
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--color-white)] text-[var(--color-black)] pt-32 pb-24">
      <div className="container max-w-4xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="mb-16 border-b border-[var(--color-light-ash)]/30 pb-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest mb-4">Frequently Asked Questions</h1>
            <p className="text-[var(--color-ash)] font-light max-w-2xl mx-auto">
              Everything you need to know about our bespoke services, from initial measurements to final delivery.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} direction="up" delay={100 + (index * 50)}>
              <div className="bg-[var(--color-ash)]/5 p-8 border border-[var(--color-ash)]/10 group hover:border-[var(--color-black)]/30 transition-colors">
                <h3 className="font-display text-xl md:text-2xl mb-4 text-[var(--color-black)]">
                  {faq.question}
                </h3>
                <p className="text-[var(--color-black)]/70 font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={400} className="mt-20 text-center">
          <h4 className="font-display text-2xl mb-4">Still have questions?</h4>
          <p className="text-[var(--color-ash)] font-light mb-8">
            Our master tailors and styling consultants are here to help.
          </p>
          <a href="/contact" className="inline-flex h-12 items-center justify-center bg-[var(--color-black)] px-8 text-sm font-bold tracking-[0.2em] text-white uppercase hover:bg-[var(--color-off-black)] transition-colors">
            Contact Us
          </a>
        </ScrollReveal>
      </div>
    </main>
  );
}
