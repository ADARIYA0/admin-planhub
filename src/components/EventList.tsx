"use client";

import { useState } from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Clock, MapPin, Users, Eye, Plus, Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import EventForm from './EventForm';

interface EventListProps {
  events: Event[];
  onViewEvent: (event: Event) => void;
  onCreateEvent: (eventData: any) => void;
}

export default function EventList({ events, onViewEvent, onCreateEvent }: EventListProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Event['status']>('all');

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleCreateEvent = (eventData: any) => {
    onCreateEvent(eventData);
    setShowCreateDialog(false);
  };

  // Filter events based on search term and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Daftar Event</h2>
            <p className="text-gray-600">Kelola semua event yang telah dibuat</p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Event Baru
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari event berdasarkan judul, lokasi, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'bg-teal-600 hover:bg-teal-700' : 'border-teal-300 text-teal-700 hover:bg-teal-50'}
            >
              Semua ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('upcoming')}
              className={statusFilter === 'upcoming' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
            >
              Akan Datang ({statusCounts.upcoming})
            </Button>
            <Button
              variant={statusFilter === 'ongoing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('ongoing')}
              className={statusFilter === 'ongoing' ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 text-green-700 hover:bg-green-50'}
            >
              Berlangsung ({statusCounts.ongoing})
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
              className={statusFilter === 'completed' ? 'bg-gray-600 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
            >
              Selesai ({statusCounts.completed})
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-teal-500 flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2 flex-1">
                    {event.title}
                  </CardTitle>
                  {getStatusBadge(event.status)}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                {event.flyer && (
                  <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={event.flyer}
                      alt={`Flyer ${event.title}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-teal-600 flex-shrink-0" />
                    <span className="truncate">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-teal-600 flex-shrink-0" />
                    <span>{event.time} WIB</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-teal-600 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-teal-600 flex-shrink-0" />
                    <span>{event.participants} peserta</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {event.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewEvent(event)}
                    className="w-full border-teal-300 text-teal-700 hover:bg-teal-50 mt-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Card className="p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-4" />
              <h3 className="text-lg mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Tidak Ada Event Ditemukan' : 'Belum Ada Event'}
              </h3>
              <p className="text-sm md:text-base">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Coba ubah kata kunci pencarian atau filter status'
                  : 'Buat event pertama Anda untuk mulai mengelola kegiatan'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Event Pertama
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Event Baru</DialogTitle>
            <DialogDescription>
              Lengkapi informasi event yang akan diselenggarakan
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            onSubmit={handleCreateEvent}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
