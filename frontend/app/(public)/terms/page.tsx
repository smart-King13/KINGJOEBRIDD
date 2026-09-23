import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Terms of Service | KINGJOEBRIDD FASHION',
  description: 'Terms and conditions for using the KINGJOEBRIDD FASHION platform and bespoke tailoring services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-white)] text-[var(--color-black)] pt-32 pb-24">
      <div className="container max-w-4xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="mb-16 border-b border-[var(--color-light-ash)]/30 pb-8">
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest mb-4">Terms of Service</h1>
            <p className="text-[var(--color-ash)] uppercase tracking-wider text-xs font-bold">Last Updated: October 2026</p>
          </div>
        </ScrollReveal>

        <div className="space-y-12 text-base md:text-lg text-[var(--color-black)]/80 leading-relaxed font-light">
          <ScrollReveal direction="up" delay={100}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the KINGJOEBRIDD FASHION website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our services.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">2. Bespoke Tailoring Services</h2>
              <p className="mb-4">Our bespoke tailoring services require precise collaboration:</p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-ash)]">
                <li><strong className="text-[var(--color-black)]">Measurements:</strong> Customers are responsible for providing accurate measurements if not measured by our in-house tailors.</li>
                <li><strong className="text-[var(--color-black)]">Consultations:</strong> Design consultations may incur a non-refundable fee, which will be credited toward your final order.</li>
                <li><strong className="text-[var(--color-black)]">Fittings:</strong> We offer a specified number of fittings per garment. Additional alterations outside the agreed scope may incur extra charges.</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">3. Payments and Quotes</h2>
              <p>
                All quotes provided for bespoke garments are valid for 14 days. Production will only commence once a deposit (typically 70% of the total cost, unless otherwise agreed) has been received. The remaining balance must be cleared before the final garment is delivered or picked up.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">4. Intellectual Property</h2>
              <p>
                All content published and made available on our site is the property of KINGJOEBRIDD FASHION. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our site.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">5. Cancellations and Refunds</h2>
              <p>
                Due to the customized nature of bespoke tailoring, orders cannot be canceled once fabrics have been cut. If an order is canceled before cutting commences, the deposit may be partially refunded, minus consultation and material sourcing fees. Completed bespoke garments are strictly non-refundable.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={350}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">6. Contact Information</h2>
              <p>
                For any questions or concerns regarding these terms, please contact us at legal@kingjoebridd.com.
              </p>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
