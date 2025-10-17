"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/chat");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
             Firebase Chat
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Connect with friends and family in real-time
          </p>
          <p className="text-lg text-white/80">
            Fast  Secure  Simple
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white text-center">
            <div className="text-4xl mb-3"></div>
            <h3 className="font-semibold text-lg mb-2">Real-time Messaging</h3>
            <p className="text-sm text-white/80">
              Send and receive messages instantly
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white text-center">
            <div className="text-4xl mb-3"></div>
            <h3 className="font-semibold text-lg mb-2">Secure Authentication</h3>
            <p className="text-sm text-white/80">
              Sign in safely with email or Google
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white text-center">
            <div className="text-4xl mb-3"></div>
            <h3 className="font-semibold text-lg mb-2">Cloud Powered</h3>
            <p className="text-sm text-white/80">
              Access your chats from anywhere
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/signup"
            className="bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl text-center"
          >
            Get Started - It's Free
          </Link>
          <Link
            href="/login"
            className="bg-white/20 backdrop-blur-lg text-white font-bold px-8 py-4 rounded-full hover:bg-white/30 transition-all transform hover:scale-105 border-2 border-white/50 text-center"
          >
            Sign In
          </Link>
        </div>

        <div className="text-white/70 text-sm">
          Built with Next.js, Firebase & Tailwind CSS
        </div>
      </div>
    </div>
  );
}
