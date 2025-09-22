"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import AdminLayout from '@/components/AdminLayout';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';
import { Event } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Image, Award, FileText } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  const handleCreateEvent = (eventData: any) => {
    const newEvent: Event = {
      ...eventData,
      date: new Date(eventData.date),
      participants: 0,
      status: 'upcoming' as const
    };
    
    setEvents(prev => [...prev, newEvent]);
    toast.success('Event berhasil dibuat!', {
      description: `Event "${eventData.title}" telah ditambahkan ke sistem.`
    });
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: Event['status']) => {
    const statusConfig = {
      upcoming: { label: 'Akan Datang', className: 'bg-blue-100 text-blue-800' },
      ongoing: { label: 'Berlangsung', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Selesai', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={`${config.className} border-0`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <EventList 
        events={events} 
        onViewEvent={handleViewEvent}
        onCreateEvent={handleCreateEvent}
      />
      
      <Toaster position="top-right" richColors />

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-lg md:text-xl">{selectedEvent.title}</span>
                  {getStatusBadge(selectedEvent.status)}
                </DialogTitle>
                <DialogDescription>
                  Detail lengkap informasi event
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Flyer */}
                {selectedEvent.flyer && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-teal-600" />
                      <h4 className="font-medium">Flyer Event</h4>
                    </div>
                    <div className="h-48 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={selectedEvent.flyer}
                        alt={`Flyer ${selectedEvent.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        <span className="text-sm font-medium">Tanggal & Waktu</span>
                      </div>
                      <p className="text-sm">{formatDate(selectedEvent.date)}</p>
                      <p className="text-sm text-gray-600">{selectedEvent.time} WIB</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        <span className="text-sm font-medium">Lokasi</span>
                      </div>
                      <p className="text-sm">{selectedEvent.location}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-teal-600" />
                        <span className="text-sm font-medium">Peserta</span>
                      </div>
                      <p className="text-sm">{selectedEvent.participants} orang terdaftar</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-teal-600" />
                        <span className="text-sm font-medium">Sertifikat</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.certificate ? 'Tersedia' : 'Tidak tersedia'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-600" />
                    <h4 className="font-medium">Deskripsi Event</h4>
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Certificate Preview */}
                {selectedEvent.certificate && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-teal-600" />
                      <h4 className="font-medium">Template Sertifikat</h4>
                    </div>
                    <div className="h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={selectedEvent.certificate}
                        alt={`Sertifikat ${selectedEvent.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
