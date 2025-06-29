'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  createdAt?: any;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin === 'true') {
      setIsAuthorized(true);
      fetchContacts();

      let timeout: NodeJS.Timeout;
      const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          localStorage.removeItem('admin');
          alert('Session expired due to inactivity.');
          router.push('/admin/login');
        }, 5 * 60 * 1000);
      };

      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach((event) => document.addEventListener(event, resetTimer));
      resetTimer();

      return () => {
        clearTimeout(timeout);
        events.forEach((event) =>
          document.removeEventListener(event, resetTimer)
        );
      };
    } else {
      router.push('/admin/login');
    }
  }, []);

  const fetchContacts = async () => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Contact[];
    setContacts(data);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this contact message?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'contacts', id));
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete. Try again.');
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="mt-24 max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📩 Contact Messages</h1>

      {contacts.length === 0 ? (
        <p className="text-gray-600">No contact messages found.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-semibold text-lg">{contact.name}</h2>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.phone && <p className="text-sm text-gray-600">📞 {contact.phone}</p>}
                </div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  ❌ Delete
                </button>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                <strong>Subject:</strong> {contact.subject || '—'}
              </p>
              <p className="text-sm text-gray-700">{contact.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
