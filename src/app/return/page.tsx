'use client';

export default function ReturnRefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 mt-20 text-gray-800">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Return & Refund Policy</h1>

        <p className="mb-4">
          At <strong>Herbolife</strong>, we take pride in the quality of our products. If you are not completely
          satisfied with your purchase, we offer a return and refund policy subject to the terms and conditions below.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Eligibility for Returns</h2>
        <p className="mb-4">
          Products may be returned within <strong>7 days of delivery</strong> if they are unopened, untampered, and in
          their original packaging. A valid proof of purchase is required. Returns are not accepted for opened or
          damaged boxes.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Return Process</h2>
        <p className="mb-4">
          To initiate a return, contact our customer care at <strong>support@herbolife.in</strong> or call us at{' '}
          <strong>+918603241934</strong>. You will receive a Return Request Number. Please ensure this number is
          mentioned in all return-related communication.
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Fill out the refund form sent by our support team.</li>
          <li>Ship the item using a reliable courier and email the tracking details.</li>
          <li>Clearly mention your full name, billing address, and contact number on the package.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Return Address</h2>
        <p className="mb-4 whitespace-pre-line">
          Herbolife{'\n'}
    
          Gurgaon, Haryana - 122002
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Refund Terms</h2>
        <p className="mb-4">
          Upon receiving and verifying the returned product, the refund will be processed within{' '}
          <strong>75 working days</strong>. Shipping charges are non-refundable, and return shipping costs must be borne
          by the customer.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Order Cancellations</h2>
        <p className="mb-4">
          Orders can be cancelled prior to dispatch, subject to a <strong>15% deduction</strong> as processing fee.
          Orders already shipped cannot be cancelled.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Conditions for Rejection</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Damaged or tampered packaging.</li>
          <li>Missing labels or unsealed boxes.</li>
          <li>Returns submitted after the 7-day window.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Disclaimer</h2>
        <p className="mb-4">
          Herbolife reserves the right to refuse a return or refund if the conditions mentioned above are not met. All
          decisions made by Herbolife regarding returns and refunds are final and binding.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Need Help?</h2>
        <p className="mb-2">For assistance with your return or refund, please contact us:</p>
        <ul className="list-none mb-2 space-y-1">
          <li>📧 <strong>Email:</strong> support@herbolife.in</li>
          <li>📞 <strong>Phone:</strong> 8603241934</li>
        </ul>
      </div>
    </div>
  );
}
