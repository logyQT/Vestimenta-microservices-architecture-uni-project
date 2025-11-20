import { LegalLayout } from "../components/layout/LegalLayout";

export function TermsOfService() {
  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "usage", title: "2. Usage of Site" },
    { id: "products", title: "3. Product Availability & Pricing" },
    { id: "intellectual", title: "4. Intellectual Property" },
    { id: "liability", title: "5. Limitation of Liability" },
    { id: "governing", title: "6. Governing Law" },
  ];

  return (
    <LegalLayout title="Terms of Service" lastUpdated="October 24, 2024" sections={sections}>
      <section id="acceptance" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using the Vestimenta website ("Site"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our Site. These terms apply to all visitors, users, and others who access or use the Service.
        </p>
      </section>

      <section id="usage" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">2. Usage of Site</h2>
        <p className="mb-4">
          You are granted a limited, non-exclusive, revocable license to access and use the Site for personal, non-commercial purposes. You agree not to use the Site for any illegal or unauthorized purpose.
        </p>
        <p className="mb-4">
          We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, including, without limitation, if we believe that customer conduct violates applicable law or is harmful to our interests.
        </p>
      </section>

      <section id="products" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">3. Product Availability & Pricing</h2>
        <p className="mb-4">
          All products displayed on the Site are subject to availability. We reserve the right to limit the quantity of products we supply, supply only part of an order, or to divide up orders.
        </p>
        <p className="mb-4">
          Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
        </p>
      </section>

      <section id="intellectual" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">4. Intellectual Property</h2>
        <p className="mb-4">
          The Site and its original content, features, and functionality are and will remain the exclusive property of Vestimenta and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Vestimenta.
        </p>
      </section>

      <section id="liability" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">5. Limitation of Liability</h2>
        <p className="mb-4">
          In no event shall Vestimenta, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
      </section>

      <section id="governing" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">6. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed and construed in accordance with the laws of Italy, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
      </section>
    </LegalLayout>
  );
}

export function PrivacyPolicy() {
  const sections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Information" },
    { id: "sharing", title: "3. Information Sharing" },
    { id: "cookies", title: "4. Cookies & Tracking" },
    { id: "rights", title: "5. Your Rights" },
    { id: "contact", title: "6. Contact Us" },
  ];

  return (
    <LegalLayout title="Privacy Policy" lastUpdated="October 24, 2024" sections={sections}>
      <section id="collection" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact customer support. This may include your name, email address, shipping address, payment information, and phone number.
        </p>
      </section>

      <section id="usage" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">2. How We Use Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2 text-zinc-400">
          <li>Process your transactions and manage your orders.</li>
          <li>Send you technical notices, updates, security alerts, and support messages.</li>
          <li>Communicate with you about products, services, offers, and events offered by Vestimenta.</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our Services.</li>
        </ul>
      </section>

      <section id="sharing" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">3. Information Sharing</h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf, such as payment processing, shipping, and data analysis.
        </p>
      </section>

      <section id="cookies" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">4. Cookies & Tracking</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>
      </section>

      <section id="rights" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">5. Your Rights</h2>
        <p className="mb-4">
          Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal data. To exercise these rights, please contact us at privacy@vestimenta.com.
        </p>
      </section>

      <section id="contact" className="scroll-mt-32 mb-12">
        <h2 className="text-2xl text-white font-serif mb-4">6. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us via email at privacy@vestimenta.com.
        </p>
      </section>
    </LegalLayout>
  );
}
