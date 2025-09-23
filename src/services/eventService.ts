import { Event } from '@/types';
import { ApiEvent, ApiEventResponse, ApiSingleEventResponse } from '@/types/api';
import { CreateEventFormData, CreateEventResponse, EventApiError } from '@/types/event-api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_KEY is not defined in environment variables');
}

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_BASE_URL is not defined in environment variables');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

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

  // Build proper URLs for images based on backend file structure
  // Backend menyimpan files dengan path yang sesuai dengan UPLOAD_DIRS di upload.js
  const flyerUrl = apiEvent.flyer_kegiatan 
    ? `${BASE_URL?.replace(/\/$/, '') || ''}/uploads/flyer/${apiEvent.flyer_kegiatan}`
    : '';
  
  const certificateUrl = apiEvent.sertifikat_kegiatan 
    ? `${BASE_URL?.replace(/\/$/, '') || ''}/uploads/certificates/${apiEvent.sertifikat_kegiatan}`
    : '';

  const imageUrl = apiEvent.gambar_kegiatan 
    ? `${BASE_URL?.replace(/\/$/, '') || ''}/uploads/events/${apiEvent.gambar_kegiatan}`
    : '';


  return {
    id: apiEvent.id.toString(),
    title: apiEvent.judul_kegiatan,
    date: startDate,
    startDate: startDate,
    endDate: endDate,
    time: timeString,
    location: apiEvent.lokasi_kegiatan,
    flyer: flyerUrl,
    certificate: certificateUrl,
    imageUrl: imageUrl,
    description: apiEvent.deskripsi_kegiatan,
    participants: apiEvent.attendee_count || 0,
    capacity: apiEvent.kapasitas_peserta || 0,
    status
  };
}

// ========================================
// READ EVENT FUNCTIONALITY (Fetch/Display)
// ========================================

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
    throw error;
  }
}

// ========================================
// CREATE EVENT FUNCTIONALITY (Form Submission)
// ========================================

export class EventApiService {
  private static getHeaders(includeContentType = true): HeadersInit {
    const headers: HeadersInit = {};

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: EventApiError;
      
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `HTTP Error ${response.status}: ${response.statusText}`
        };
      }

      throw new Error(errorData.message || 'An error occurred');
    }

    return response.json();
  }

  static async createEvent(formData: CreateEventFormData): Promise<CreateEventResponse> {
    try {
      const form = new FormData();
      
      // Add required fields
      form.append('judul_kegiatan', formData.judul_kegiatan);
      form.append('deskripsi_kegiatan', formData.deskripsi_kegiatan);
      form.append('lokasi_kegiatan', formData.lokasi_kegiatan);
      form.append('waktu_mulai', formData.waktu_mulai);
      form.append('waktu_berakhir', formData.waktu_berakhir);

      // Add optional fields
      if (formData.slug) {
        form.append('slug', formData.slug);
      }

      // Always append kapasitas_peserta and harga (backend expects them)
      form.append('kapasitas_peserta', (formData.kapasitas_peserta || 0).toString());
      form.append('harga', (formData.harga || 0).toString());

      if (formData.kategori_id) {
        form.append('kategori_id', formData.kategori_id.toString());
      }

      if (formData.kategori_slug) {
        form.append('kategori_slug', formData.kategori_slug);
      }

      // Add file fields - backend expects File objects, not URLs
      if (formData.flyer_kegiatan && typeof formData.flyer_kegiatan !== 'string') {
        form.append('flyer_kegiatan', formData.flyer_kegiatan);
      }

      if (formData.gambar_kegiatan && typeof formData.gambar_kegiatan !== 'string') {
        form.append('gambar_kegiatan', formData.gambar_kegiatan);
      }

      if (formData.sertifikat_kegiatan && typeof formData.sertifikat_kegiatan !== 'string') {
        form.append('sertifikat_kegiatan', formData.sertifikat_kegiatan);
      }

      const response = await fetch(`${API_BASE_URL}/event`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: form,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: 'Unknown error - could not parse response' };
        }
        
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static validateEventForm(data: Partial<CreateEventFormData>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!data.judul_kegiatan?.trim()) {
      errors.judul_kegiatan = 'Judul kegiatan wajib diisi';
    } else if (data.judul_kegiatan.length > 255) {
      errors.judul_kegiatan = 'Judul kegiatan maksimal 255 karakter';
    }

    if (!data.deskripsi_kegiatan?.trim()) {
      errors.deskripsi_kegiatan = 'Deskripsi kegiatan wajib diisi';
    }

    if (!data.lokasi_kegiatan?.trim()) {
      errors.lokasi_kegiatan = 'Lokasi kegiatan wajib diisi';
    }

    if (!data.waktu_mulai) {
      errors.waktu_mulai = 'Waktu mulai wajib diisi';
    }

    if (!data.waktu_berakhir) {
      errors.waktu_berakhir = 'Waktu berakhir wajib diisi';
    }

    // Date validation
    if (data.waktu_mulai && data.waktu_berakhir) {
      const startDate = new Date(data.waktu_mulai);
      const endDate = new Date(data.waktu_berakhir);

      if (isNaN(startDate.getTime())) {
        errors.waktu_mulai = 'Format waktu mulai tidak valid';
      }

      if (isNaN(endDate.getTime())) {
        errors.waktu_berakhir = 'Format waktu berakhir tidak valid';
      }

      if (startDate.getTime() && endDate.getTime() && endDate < startDate) {
        errors.waktu_berakhir = 'Waktu berakhir harus setelah waktu mulai';
      }
    }

    // Optional fields validation
    if (data.kapasitas_peserta !== undefined && data.kapasitas_peserta < 0) {
      errors.kapasitas_peserta = 'Kapasitas peserta tidak boleh negatif';
    }

    if (data.harga !== undefined && data.harga < 0) {
      errors.harga = 'Harga tidak boleh negatif';
    }

    // File validation - only validate if it's a File object
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Gambar Event is OPTIONAL but must be image only if provided
    if (data.gambar_kegiatan && typeof data.gambar_kegiatan !== 'string') {
      if (data.gambar_kegiatan.size > maxFileSize) {
        errors.gambar_kegiatan = 'Ukuran file gambar maksimal 10MB';
      } else if (!allowedImageTypes.includes(data.gambar_kegiatan.type)) {
        errors.gambar_kegiatan = 'Format file gambar harus JPG, PNG, atau WebP';
      }
    }

    // Flyer Event is OPTIONAL, hanya image yang diizinkan
    if (data.flyer_kegiatan && typeof data.flyer_kegiatan !== 'string') {
      if (data.flyer_kegiatan.size > maxFileSize) {
        errors.flyer_kegiatan = 'Ukuran file flyer maksimal 10MB';
      } else if (!allowedImageTypes.includes(data.flyer_kegiatan.type)) {
        errors.flyer_kegiatan = 'Format file flyer harus JPG, PNG, atau WebP';
      }
    }

    // Sertifikat is OPTIONAL, hanya image yang diizinkan
    if (data.sertifikat_kegiatan && typeof data.sertifikat_kegiatan !== 'string') {
      if (data.sertifikat_kegiatan.size > maxFileSize) {
        errors.sertifikat_kegiatan = 'Ukuran file sertifikat maksimal 10MB';
      } else if (!allowedImageTypes.includes(data.sertifikat_kegiatan.type)) {
        errors.sertifikat_kegiatan = 'Format file sertifikat harus JPG, PNG, atau WebP';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
