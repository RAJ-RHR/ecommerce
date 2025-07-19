'use client';

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-20">
      <div className="bg-white shadow-lg rounded-xl p-8 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

        <p className="mb-4">
          The terms and conditions mentioned below form a legally binding agreement for the website{' '}
          <strong>store.herbolife.in</strong> and the products listed on it. Please read these terms carefully.
          By placing an order, you agree to abide by them.
        </p>

        <p className="mb-4">
          No information on this website should be considered as medical advice or a replacement for consultation
          with a qualified healthcare provider. You are advised to consult a medical expert before starting
          any supplement purchased from Herbolife.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. General Terms</h2>
        <p className="mb-4">
          Accessing this website and placing orders indicate your acceptance of these terms. Herbolife reserves
          the right to update or change the terms at any time without prior notice. Continued usage of the site
          constitutes acceptance of those changes.
        </p>

        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Products are intended only for users in India and are approved by authorities such as FSSAI and Ayush.</li>
          <li>You must be 18+ years old or legally capable of entering into a contract to place orders.</li>
          <li>We reserve the right to refuse or cancel any order for any reason.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Orders & Deliveries</h2>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Orders must be paid in full at the time of placing the order.</li>
          <li>
            We aim to deliver within two weeks of confirmation, but delivery timelines may vary depending on
            location and availability.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. User Eligibility & Conduct</h2>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Users must provide accurate and verifiable information when using the website.</li>
          <li>We reserve the right to suspend or terminate accounts that violate our terms.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Disclaimer</h2>
        <p className="mb-4">
          The website and its content are provided on an "as-is" and "as-available" basis. We make no warranties
          regarding the accuracy, reliability, or outcomes of product usage. Herbolife is not responsible for
          any indirect or consequential damages arising from use of the site or products.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Intellectual Property</h2>
        <p className="mb-4">
          All content, trademarks, and product visuals are the property of Herbolife or its licensors.
          No material may be reused or republished without explicit written permission.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify and hold harmless Herbolife, its directors, affiliates, and employees from
          any claims or liabilities arising out of your use of the site, violation of terms, or infringement
          of any third-party rights.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Termination</h2>
        <p className="mb-4">
          These terms remain in effect unless terminated by either party. We reserve the right to suspend or
          terminate user access without notice if any misuse or violation is detected.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by Indian law. Jurisdiction for any disputes shall be exclusively in Mumbai, India.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
        <p>
          For any queries or concerns regarding these Terms & Conditions, please email us at:{' '}
          <a href="herbolifeco@gmail.com" className="text-green-600 underline">
            support@herbolife.in
          </a>
        </p>
      </div>
    </div>
  );
}
