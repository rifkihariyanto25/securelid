"use client";

import React from "react";
import StatCard from "../../components/startcard";
import { Users, Info, SquareActivity } from "lucide-react";

const OverviewPage = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard name="Total Sales" Icon={Users} value="$182,450" />
                    <StatCard name="Total Products" Icon={Info} value="674" />
                    <StatCard name="Stock" Icon={SquareActivity} value="12,845" />
                </div>
            </main>
        </div>
    );
};

export default OverviewPage;