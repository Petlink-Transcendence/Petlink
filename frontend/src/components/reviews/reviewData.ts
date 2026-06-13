import type { Review } from './ReviewCard';

export const initialReviews: Review[] = [
  {
    id: 1,
    reviewer: 'Rodrigo Silva',
    role: 'Cat owner',
    service: 'Cat sitting',
    rating: 5,
    text: 'Ana took excellent care of Luna and sent updates every evening. I felt completely comfortable while I was away.',
    time: '6 hours ago',
  },
  {
    id: 2,
    reviewer: 'Jane Doe',
    role: 'Pet owner',
    service: 'Dog walking',
    rating: 5,
    text: 'Very reliable and kind with Buddy. The walks were always on time and the communication was clear.',
    time: '2 weeks ago',
  },
  {
    id: 3,
    reviewer: 'Miguel Ramos',
    role: 'Dog owner',
    service: 'Home visits',
    rating: 4,
    text: 'Great experience overall. The visit notes were helpful and my dog was relaxed when I got home.',
    time: '1 month ago',
  },
  {
    id: 4,
    reviewer: 'Sofia Martins',
    role: 'Rabbit owner',
    service: 'Overnight stay',
    rating: 5,
    text: 'Careful, patient, and professional. I would book again for longer trips.',
    time: '2 months ago',
  },
];
