'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, message } = form;

    if (!name || !email || !message || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number starting with 6-9.');
      return;
    }

    try {
    await addDoc(collection(db, 'contacts'), {
  ...form,
  createdAt: Timestamp.now(),
  read: false, // 🟡 Add default read field
});


      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '', phone: '' });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="mt-20">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/" className="text-gray-700 hover:underline">
            Home
          </Link>{' '}
          / <span>Contact</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <div>
            <Image
              src="/images/banner.jpg"
              alt="Herbolife Products"
              className="w-full rounded-lg"
              width={600}
              height={600}
            />
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">CONTACT US</h2>
            <p className="text-sm text-gray-600 mb-6">
              If you have any questions or concerns, please do not hesitate to contact us.
            </p>

            {success && (
              <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-3 rounded mb-4 text-sm">
                ✅ Thank you. We will get back to you.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name*"
                required
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email*"
                required
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone*"
                pattern="[6-9]{1}[0-9]{9}"
                maxLength={10}
                required
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
              />
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Message*"
                required
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
