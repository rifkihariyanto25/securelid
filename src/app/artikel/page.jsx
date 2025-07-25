"use client";
import React from "react";
import { motion } from "framer-motion";
import StatCard from "../../components/startcard";
import {
    Users,
    Info,
    SquareActivity
} from "lucide-react";
import ArtikelTabel from "../../components/artikeltabel";

const artikel = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                <ArtikelTabel />
            </main>
        </div>
    );
};

export default artikel;