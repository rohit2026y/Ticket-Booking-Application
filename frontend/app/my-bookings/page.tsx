"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Booking {
    id: number;
    event_id: number;
    seats_booked: number;
    status: string;
    created_at: string;
    event_title?: string; // We might need to fetch this or include in API
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && !localStorage.getItem('token') && !document.cookie.includes('token')) {
            // router.push('/login');
        }
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            // Ideally API should return event details with booking
            // For now, we might fetch events separately to map titles if API doesn't return
            // Let's update the backend to include event title in booking response or fetch lookup here
            // Current Backend BookingResponse: id, user_id, status, created_at, event_id, seats_booked

            const res = await api.get('/bookings/');
            const bookingData = res.data;

            // Fetch events to map titles (inefficient but works for MVP without backend change)
            const eventRes = await api.get('/events/');
            const events = eventRes.data;
            const eventMap = new Map(events.map((e: any) => [e.id, e.title]));

            const enriched = bookingData.map((b: any) => ({
                ...b,
                event_title: eventMap.get(b.event_id) || `Event #${b.event_id}`
            }));

            setBookings(enriched);
        } catch (error) {
            console.error("Error fetching bookings", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500 mb-4">You haven't booked any tickets yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Booked</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{booking.event_title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{booking.seats_booked}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{new Date(booking.created_at).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
