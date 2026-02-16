"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    available_seats: number;
    total_seats: number;
}

export default function BookingPage() {
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { register, handleSubmit, watch } = useForm();

    const seatsToBook = watch("seats", 1);

    useEffect(() => {
        if (!isAuthenticated && !localStorage.getItem('token') && !document.cookie.includes('token')) {
            // Simple client-side check, middleware handles better protection
            // router.push('/login');
        }
        if (id) {
            fetchEvent();
        }
    }, [id]);

    const [error, setError] = useState<string | null>(null);

    const fetchEvent = async () => {
        try {
            console.log("Fetching event with ID:", id);
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
        } catch (error: any) {
            console.error("Error fetching event", error);
            setError(error.message || "Unknown error");
            toast.error("Event not found");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (!user) {
            toast.error("Please login to book tickets");
            router.push('/login');
            return;
        }

        try {
            const seats = parseInt(data.seats);
            await api.post('/bookings/', {
                event_id: parseInt(id),
                seats_booked: seats
            });
            toast.success("Booking confirmed! Check your email.");
            router.push('/my-bookings');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Booking failed");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading... (ID: {JSON.stringify(id)})</div>;
    if (!event) return (
        <div className="text-center mt-10">
            <h2 className="text-xl font-bold text-red-600">Event not found</h2>
            <p className="mt-2 text-gray-600">Requested ID: {JSON.stringify(id)}</p>
            <p className="mt-2 text-red-500">Error: {error}</p>
            <p className="mt-2 text-gray-400">Please verify the URL is correct (e.g. /book/1)</p>
            <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Retry</button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{event.title}</h1>
            <p className="text-gray-600 mb-6">{event.description}</p>

            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <span className="block text-sm text-gray-500">Date</span>
                    <span className="font-semibold text-gray-900">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div>
                    <span className="block text-sm text-gray-500">Availability</span>
                    <span className={`font-semibold ${event.available_seats < 5 ? 'text-red-500' : 'text-green-500'}`}>
                        {event.available_seats} seats left
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-lg font-medium mb-2 text-gray-700">Number of Seats</label>
                    <select
                        {...register('seats', { required: true })}
                        className="w-full border p-3 rounded-lg text-lg text-gray-900 bg-white"
                    >
                        {[...Array(Math.min(10, event.available_seats))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-gray-50 p-4 rounded text-right">
                    <span className="text-gray-500">Total Price: </span>
                    <span className="text-2xl font-bold ml-2 text-gray-900">Free</span>
                </div>

                <button
                    type="submit"
                    disabled={event.available_seats <= 0}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                    Confirm Booking
                </button>
            </form>
        </div>
    );
}
