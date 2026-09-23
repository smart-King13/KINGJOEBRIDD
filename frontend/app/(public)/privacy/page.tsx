import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Privacy Policy | KINGJOEBRIDD FASHION',
  description: 'Our commitment to protecting your privacy and personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-white)] text-[var(--color-black)] pt-32 pb-24">
      <div className="container max-w-4xl mx-auto px-6">
        <ScrollReveal direction="up">
          <div className="mb-16 border-b border-[var(--color-light-ash)]/30 pb-8">
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest mb-4">Privacy Policy</h1>
            <p className="text-[var(--color-ash)] uppercase tracking-wider text-xs font-bold">Last Updated: October 2026</p>
          </div>
        </ScrollReveal>

        <div className="space-y-12 text-base md:text-lg text-[var(--color-black)]/80 leading-relaxed font-light">
          <ScrollReveal direction="up" delay={100}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">1. Introduction</h2>
              <p>
                At KINGJOEBRIDD FASHION ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website, submit style requests, or engage with our bespoke tailoring services.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">2. The Data We Collect</h2>
              <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-ash)]">
                <li><strong className="text-[var(--color-black)]">Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong className="text-[var(--color-black)]">Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong className="text-[var(--color-black)]">Measurement Data:</strong> includes specific body measurements provided for bespoke tailoring purposes.</li>
                <li><strong className="text-[var(--color-black)]">Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              </ul>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you (such as creating your bespoke garments), where it is necessary for our legitimate interests, or where we need to comply with a legal obligation.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <section>
              <h2 className="font-display text-2xl mb-4 text-[var(--color-black)]">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@kingjoebridd.com.
              </p>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
