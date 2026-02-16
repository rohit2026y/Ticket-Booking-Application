import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-xl font-bold">
                    Ticket Booking
                </Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-300">Welcome</span>
                            <Link href="/my-bookings" className="text-gray-300 hover:text-white">
                                My Bookings
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-300 hover:text-white">
                                Login
                            </Link>
                            <Link href="/register" className="text-gray-300 hover:text-white">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
