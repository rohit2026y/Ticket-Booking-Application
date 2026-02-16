"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  available_seats: number;
  total_seats: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/');
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
      // toast.error("Could not load events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading events...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>
              <p className="text-gray-700 mb-4 h-12 overflow-hidden">{event.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span className={`font-bold ${event.available_seats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {event.available_seats} / {event.total_seats} seats left
                </span>
              </div>
              <Link
                href={`/book/${event.id}`}
                className={`block text-center w-full py-2 rounded transition ${event.available_seats > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                onClick={(e) => { if (event.available_seats <= 0) e.preventDefault() }}
              >
                {event.available_seats > 0 ? 'Book Now' : 'Sold Out'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
