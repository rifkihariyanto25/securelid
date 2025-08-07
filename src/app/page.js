// Ini adalah server component untuk redirect
export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";

export default function Home() {
  // Redirect ke landing page saat aplikasi pertama kali dijalankan
  redirect("/landingpage");
  return null; // Ini tidak akan dirender karena redirect
}
