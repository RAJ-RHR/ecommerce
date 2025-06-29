export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 mt-20 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At Herbolife, we are committed to protecting your personal information. This Privacy Policy
        outlines how we collect, use, and safeguard your data when you use our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>Your name, email, phone number, and address</li>
        <li>Order details and purchase history</li>
        <li>Any information you provide through our contact forms</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>To process your orders and deliver products</li>
        <li>To respond to your inquiries</li>
        <li>To send updates and promotional offers (only if opted in)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        We implement industry-standard security measures to protect your data. However, no method of
        transmission over the Internet is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <p className="mb-4">
        We do not sell or rent your data. We may use third-party services (e.g., Razorpay, Firebase)
        to manage orders and payments.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Consent</h2>
      <p className="mb-4">
        By using our website, you consent to this privacy policy. If we make changes, they will be
        posted on this page.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p>
        If you have any questions regarding this privacy policy, you can email us at:{' '}
        <a href="mailto:contact@herbolife.in" className="text-green-600 underline">
          contact@herbolife.in
        </a>
      </p>
    </div>
  );
}
