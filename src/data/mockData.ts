import { Event, Participant, MonthlyStats } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Workshop Digital Marketing 2024',
    date: new Date('2024-01-15'),
    time: '09:00',
    location: 'Hotel Grand Ballroom Jakarta',
    flyer: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Workshop komprehensif tentang strategi digital marketing untuk UMKM',
    participants: 150,
    status: 'completed'
  },
  {
    id: '2',
    title: 'Seminar Entrepreneurship Summit',
    date: new Date('2024-02-20'),
    time: '13:00',
    location: 'Convention Center Surabaya',
    flyer: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Seminar inspiratif dengan para pengusaha sukses Indonesia',
    participants: 300,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Training Leadership Excellence',
    date: new Date('2024-03-10'),
    time: '08:30',
    location: 'Auditorium Universitas Indonesia',
    flyer: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Pelatihan kepemimpinan untuk generasi muda',
    participants: 200,
    status: 'completed'
  },
  {
    id: '4',
    title: 'Conference Tech Innovation 2024',
    date: new Date('2024-04-25'),
    time: '10:00',
    location: 'ICE BSD Tangerang',
    flyer: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Konferensi teknologi dan inovasi terbesar di Indonesia',
    participants: 500,
    status: 'completed'
  },
  {
    id: '5',
    title: 'Workshop Content Creation',
    date: new Date('2024-05-12'),
    time: '14:00',
    location: 'Co-working Space Bandung',
    flyer: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Pelatihan membuat konten kreatif untuk media sosial',
    participants: 75,
    status: 'completed'
  },
  {
    id: '6',
    title: 'Expo Startup Indonesia',
    date: new Date('2024-06-18'),
    time: '09:00',
    location: 'JCC Senayan Jakarta',
    flyer: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Pameran startup terbesar dengan investor dan mentor terbaik',
    participants: 800,
    status: 'completed'
  },
  {
    id: '7',
    title: 'Workshop Financial Literacy',
    date: new Date('2024-07-22'),
    time: '10:30',
    location: 'Ballroom Hotel Marriott',
    flyer: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Edukasi literasi keuangan untuk masyarakat umum',
    participants: 120,
    status: 'completed'
  },
  {
    id: '8',
    title: 'Conference Sustainable Business',
    date: new Date('2024-08-15'),
    time: '08:00',
    location: 'Bali International Convention Centre',
    flyer: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Konferensi bisnis berkelanjutan dan ramah lingkungan',
    participants: 350,
    status: 'completed'
  },
  {
    id: '9',
    title: 'Training Public Speaking',
    date: new Date('2024-09-08'),
    time: '13:30',
    location: 'Auditorium ITB Bandung',
    flyer: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Pelatihan public speaking dan presentasi yang efektif',
    participants: 90,
    status: 'completed'
  },
  {
    id: '10',
    title: 'Seminar Health & Wellness',
    date: new Date('2024-10-30'),
    time: '11:00',
    location: 'Grand Ballroom Yogyakarta',
    flyer: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    certificate: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
    description: 'Seminar kesehatan dan wellness lifestyle',
    participants: 180,
    status: 'upcoming'
  }
];

export const monthlyStats: MonthlyStats[] = [
  { month: 'Jan', events: 2, participants: 200 },
  { month: 'Feb', events: 3, participants: 450 },
  { month: 'Mar', events: 2, participants: 300 },
  { month: 'Apr', events: 1, participants: 500 },
  { month: 'Mei', events: 2, participants: 275 },
  { month: 'Jun', events: 1, participants: 800 },
  { month: 'Jul', events: 2, participants: 220 },
  { month: 'Agu', events: 2, participants: 470 },
  { month: 'Sep', events: 1, participants: 90 },
  { month: 'Okt', events: 1, participants: 180 },
  { month: 'Nov', events: 0, participants: 0 },
  { month: 'Des', events: 0, participants: 0 }
];

export const topEvents = mockEvents
  .sort((a, b) => b.participants - a.participants)
  .slice(0, 10)
  .map(event => ({
    name: event.title.length > 25 ? event.title.substring(0, 25) + '...' : event.title,
    participants: event.participants
  }));
