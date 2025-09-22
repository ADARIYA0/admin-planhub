"use client";

import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import AdminLayout from '@/components/AdminLayout';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const handleNavigate = (tab: string) => {
    // Untuk sementara, kita hanya akan menampilkan toast
    // Nanti bisa diintegrasikan dengan routing Next.js
    toast.info(`Navigasi ke ${tab}`, {
      description: 'Fitur ini akan segera tersedia'
    });
  };

  return (
    <AdminLayout>
      <Dashboard onNavigate={handleNavigate} />
      <Toaster position="top-right" richColors />
    </AdminLayout>
  );
}
