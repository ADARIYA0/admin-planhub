import { Event } from '@/types';
import { ApiEvent, ApiEventResponse, ApiSingleEventResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_KEY is not defined in environment variables');
}

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_BASE_URL is not defined in environment variables');
}
function transformApiEventToEvent(apiEvent: ApiEvent): Event {
  const startDate = new Date(apiEvent.waktu_mulai);
  const endDate = new Date(apiEvent.waktu_berakhir);
  const now = new Date();

  let status: Event['status'] = 'upcoming';
  if (startDate <= now && endDate >= now) {
    status = 'ongoing';
  } else if (endDate < now) {
    status = 'completed';
  }

  const timeString = startDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const flyerUrl = apiEvent.gambar_kegiatan 
    ? `${BASE_URL?.replace(/\/$/, '') || ''}${apiEvent.gambar_kegiatan.startsWith('/') ? apiEvent.gambar_kegiatan : '/' + apiEvent.gambar_kegiatan}`
    : '';
  
  const certificateUrl = apiEvent.flyer_kegiatan 
    ? `${BASE_URL?.replace(/\/$/, '') || ''}${apiEvent.flyer_kegiatan.startsWith('/') ? apiEvent.flyer_kegiatan : '/' + apiEvent.flyer_kegiatan}`
    : '';


  return {
    id: apiEvent.id.toString(),
    title: apiEvent.judul_kegiatan,
    date: startDate,
    time: timeString,
    location: apiEvent.lokasi_kegiatan,
    flyer: flyerUrl,
    certificate: certificateUrl,
    description: apiEvent.deskripsi_kegiatan,
    participants: apiEvent.attendee_count,
    status
  };
}

// Fetch all events
export async function fetchEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  upcoming?: boolean;
  category?: string;
  time_range?: 'today' | 'this_week' | 'this_month' | 'next_month';
}): Promise<Event[]> {
  try {
    const url = new URL(`${API_BASE_URL}/event`);
    
    if (params?.search) {
      url.searchParams.append('search', params.search);
    }
    if (params?.upcoming !== undefined) {
      url.searchParams.append('upcoming', params.upcoming.toString());
    }
    if (params?.limit) {
      url.searchParams.append('limit', params.limit.toString());
    }
    if (params?.page) {
      url.searchParams.append('page', params.page.toString());
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error('SERVER_ERROR');
    }

    const data: ApiEventResponse = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('API_ERROR');
    }

    return data.data.map(transformApiEventToEvent);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('NETWORK_ERROR');
    }
    throw new Error('SERVER_ERROR');
  }
}

// Fetch single event by ID
export async function fetchEventById(id: string): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Event not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiSingleEventResponse = await response.json();
    return transformApiEventToEvent(data);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
}

// Fetch single event by slug
export async function fetchEventBySlug(slug: string): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE_URL}/event/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Event not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiSingleEventResponse = await response.json();
    return transformApiEventToEvent(data);
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    throw error;
  }
}
