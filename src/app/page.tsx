"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import AdminLayout from '@/components/AdminLayout';
import Dashboard from '@/components/Dashboard';
import { mockEvents } from '@/data/mockData';
import { Event } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    // Untuk sementara, kita hanya akan menampilkan toast
    // Nanti bisa diintegrasikan dengan routing Next.js
    toast.info(`Navigasi ke ${tab}`, {
      description: 'Fitur ini akan segera tersedia'
    });
  };

  return (
    <AdminLayout>
      <Dashboard events={events} onNavigate={handleNavigate} />
      <Toaster position="top-right" richColors />
    </AdminLayout>
  );
}
