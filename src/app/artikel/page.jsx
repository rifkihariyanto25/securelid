"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "../../components/startcard";
import {
    Users,
    Info,
    SquareActivity
} from "lucide-react";
import ArtikelTabel from "../../components/artikeltabel";
import Header from "../../components/header";
import Footer from "../../components/footer";
import supabase from "../../lib/supabase";
import { useRouter } from "next/navigation";

const Artikel = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.push('/login');
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Error checking authentication:', error);
                router.push('/login');
            }
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT') {
                    router.push('/login');
                }
            }
        );

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [router]);

    if (loading) {
        return (
            <div className="flex-1 overflow-auto relative z-10 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                <ArtikelTabel />
            </main>
        </div>
    );
};

export default Artikel;