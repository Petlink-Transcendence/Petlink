export type ProfileStat = {
  value: string | number;
  label: string;
};

export type ProfileSidebarCard =
  | { title: string; type: 'meta'; items: string[] }
  | { title: string; type: 'tags'; items: string[] };

export type ProfilePost = {
  id: number;
  text: string;
  time: string;
  likes: number;
};

export type ProfileReview = {
  id: number;
  author: string;
  rating: number;
  text: string;
  time: string;
};

export type BaseProfile = {
  id: string;
  name: string;
  username: string;
  role: string;
  bio: string;
  initials: string;
  imageUrl?: string;
  stats: ProfileStat[];
  sidebarCards: ProfileSidebarCard[];
  posts: ProfilePost[];
  reviews: ProfileReview[];
};

export type SitterProfileData = BaseProfile & {
  availability: {
    status: 'Accepting' | 'Not available';
    location: string;
    responseTime: string;
    capacity: string;
    windows: { label: string; time: string }[];
    services: { name: string; rate: string; detail: string }[];
  };
};

export type SearchProfile = {
  id: string;
  name: string;
  role: string;
  location: string;
  rating?: string;
  profileType: 'owner' | 'sitter';
};

export const currentOwnerProfileId = '4';
export const currentSitterProfileId = '1';

export const ownerProfiles: Record<string, BaseProfile> = {
  '4': {
    id: '4',
    name: 'Jane Doe',
    username: '@janedoe123',
    role: 'Pet Owner',
    bio: 'Dog and cat mom. Always looking for the best care for my fur babies.',
    initials: 'JD',
    imageUrl: '/profile-pic.png',
    stats: [
      { value: 21, label: 'Posts' },
      { value: 42, label: 'Followers' },
      { value: 100, label: 'Following' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since March 2023', '📍 Porto, PT'] },
      { title: 'My Pets', type: 'tags', items: ['Luna | Bengal Cat | 2yr', 'Buddy | Golden Retriever | 4yr'] },
      { title: 'Looking For', type: 'tags', items: ['Cat Sitter', 'Dog Walker', 'Home Visits', 'Overnight Stay'] },
    ],
    posts: [
      { id: 1, text: 'Available sitters for this weekend? DM me 🐱', time: '1h ago', likes: 12 },
      { id: 2, text: 'Just went on a long walk with Buddy. Such a joy!', time: '3 days ago', likes: 27 },
    ],
    reviews: [
      { id: 1, author: 'Ana C.', rating: 5, text: 'Jane is a wonderful pet owner. Luna and Buddy are so well behaved!', time: '2 weeks ago' },
      { id: 2, author: 'Miguel R.', rating: 5, text: 'Always on time and very communicative. A pleasure to work with.', time: '1 month ago' },
      { id: 3, author: 'Sara M.', rating: 4, text: 'Great experience. Buddy is a handful but Jane made it easy.', time: '2 months ago' },
    ],
  },
  '8': {
    id: '8',
    name: 'John Smith',
    username: '@johnsmith',
    role: 'Pet Owner',
    bio: 'Dog owner in Lisbon looking for reliable walkers and occasional overnight care.',
    initials: 'JS',
    stats: [
      { value: 8, label: 'Posts' },
      { value: 18, label: 'Followers' },
      { value: 31, label: 'Following' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since September 2023', '📍 Lisbon, PT'] },
      { title: 'My Pets', type: 'tags', items: ['Max | Labrador | 5yr'] },
      { title: 'Looking For', type: 'tags', items: ['Dog Walker', 'Morning Walks', 'High Energy Dogs'] },
    ],
    posts: [
      { id: 1, text: 'Still searching for someone who can walk Max on weekday mornings.', time: '5h ago', likes: 7 },
      { id: 2, text: 'Max finished his training class today and did great.', time: '1 week ago', likes: 14 },
    ],
    reviews: [
      { id: 1, author: 'Miguel R.', rating: 5, text: 'John gives clear instructions and Max is a joy to walk.', time: '3 weeks ago' },
      { id: 2, author: 'Sara M.', rating: 4, text: 'Very responsive and organized before every booking.', time: '2 months ago' },
    ],
  },
};

export const sitterProfiles: Record<string, SitterProfileData> = {
  '1': {
    id: '1',
    name: 'Ana Costa',
    username: '@anacosta_sitter',
    role: 'Cat Sitter',
    bio: 'Passionate animal lover with 5+ years of experience caring for cats and small pets. Available for sitting, grooming, and daily visits.',
    initials: 'AC',
    stats: [
      { value: '4.9', label: 'Rating' },
      { value: 38, label: 'Reviews' },
      { value: 124, label: 'Bookings' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since January 2022', '📍 Porto, PT', '⭐ 5+ years experience', '💶 15€–20€ / hour'] },
      { title: 'Pet Types', type: 'tags', items: ['Cats', 'Small Pets', 'Rabbits'] },
    ],
    availability: {
      status: 'Accepting',
      location: 'Porto + 8 km',
      responseTime: '< 1 hour',
      capacity: '2 bookings/day',
      windows: [
        { label: 'Mon - Fri', time: '09:00 - 12:00' },
        { label: 'Saturday', time: '14:00 - 18:00' },
        { label: 'Sunday', time: 'On request' },
      ],
      services: [
        { name: 'Cat Sitting', rate: '20 EUR', detail: 'Daily visits, feeding, litter care' },
        { name: 'Home Visits', rate: '15 EUR', detail: 'Short check-ins for cats and small pets' },
        { name: 'Grooming', rate: '18 EUR', detail: 'Coat brushing and basic care' },
        { name: 'Overnight Stay', rate: '45 EUR', detail: 'In-home care for longer bookings' },
      ],
    },
    posts: [
      { id: 1, text: 'Available for sitting this weekend! DM me 🐱', time: '2h ago', likes: 19 },
      { id: 2, text: 'Just finished a week with two beautiful Bengals. Such a joy! 🐈', time: '4 days ago', likes: 34 },
      { id: 3, text: 'Reminder: I offer overnight stays for cats with special needs 🏠', time: '1 week ago', likes: 22 },
    ],
    reviews: [
      { id: 1, author: 'Jane D.', rating: 5, text: 'Ana was wonderful with Luna. She sent daily updates and photos. Would definitely book again!', time: '2 weeks ago' },
      { id: 2, author: 'Mark S.', rating: 5, text: 'Very professional and caring. My cats loved her. The house was spotless when I came back.', time: '1 month ago' },
      { id: 3, author: 'Sofia R.', rating: 4, text: 'Great service, very communicative throughout the stay. Will book again for sure.', time: '2 months ago' },
      { id: 4, author: 'Tiago F.', rating: 5, text: 'Ana took amazing care of my rabbit. Highly recommend her to anyone looking for a sitter.', time: '3 months ago' },
    ],
  },
  '9': {
    id: '9',
    name: 'Junior Silva',
    username: '@juniorpets',
    role: 'Dog Sitter',
    bio: 'Experienced dog sitter focused on daily care, long walks, and calm updates for owners.',
    initials: 'JS',
    stats: [
      { value: '4.8', label: 'Rating' },
      { value: 16, label: 'Reviews' },
      { value: 47, label: 'Bookings' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since June 2023', '📍 Rio de Janeiro, BR', '⭐ Dog care specialist', '💶 20€–25€ / day'] },
      { title: 'Pet Types', type: 'tags', items: ['Dogs', 'Puppies', 'Senior Dogs'] },
    ],
    availability: {
      status: 'Accepting',
      location: 'Rio de Janeiro + 12 km',
      responseTime: '< 2 hours',
      capacity: '3 bookings/day',
      windows: [
        { label: 'Mon - Fri', time: '08:00 - 17:00' },
        { label: 'Saturday', time: '10:00 - 16:00' },
        { label: 'Sunday', time: 'On request' },
      ],
      services: [
        { name: 'Dog Sitting', rate: '25 EUR', detail: 'Daily care, walks, feeding, and playtime' },
        { name: 'Dog Walking', rate: '15 EUR', detail: 'Morning or afternoon walks for active dogs' },
        { name: 'Home Visits', rate: '18 EUR', detail: 'Short visits with feeding and check-ins' },
      ],
    },
    posts: [
      { id: 1, text: "I'm a sitter with a lot of experience with dogs!", time: '11min ago', likes: 3 },
      { id: 2, text: 'Open slots this week for energetic dogs who need longer walks.', time: '1 day ago', likes: 9 },
    ],
    reviews: [
      { id: 1, author: 'Carla P.', rating: 5, text: 'Junior handled our energetic dog with patience and confidence.', time: '1 week ago' },
      { id: 2, author: 'Bruno L.', rating: 5, text: 'Reliable, friendly, and sent helpful updates after every walk.', time: '1 month ago' },
    ],
  },
  '2': {
    id: '2',
    name: 'Miguel Reis',
    username: '@miguelreis',
    role: 'Dog Walker',
    bio: 'Focused dog walker who keeps active dogs moving with reliable morning and afternoon walks.',
    initials: 'MR',
    stats: [
      { value: '4.7', label: 'Rating' },
      { value: 22, label: 'Reviews' },
      { value: 58, label: 'Bookings' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since May 2023', '📍 Lisbon, PT', '🐕 Loves high-energy dogs', '💶 12€–18€ / walk'] },
      { title: 'Pet Types', type: 'tags', items: ['Dogs', 'Puppies', 'Large Breeds'] },
    ],
    availability: {
      status: 'Accepting',
      location: 'Lisbon + 6 km',
      responseTime: '< 1 hour',
      capacity: '4 bookings/day',
      windows: [
        { label: 'Mon - Fri', time: '07:00 - 11:00' },
        { label: 'Saturday', time: '09:00 - 13:00' },
        { label: 'Sunday', time: 'On request' },
      ],
      services: [
        { name: 'Dog Walking', rate: '15 EUR', detail: 'Walks for energetic and senior dogs' },
        { name: 'Home Visits', rate: '12 EUR', detail: 'Short check-ins, feeding, and water refresh' },
      ],
    },
    posts: [
      { id: 1, text: 'Early morning walk slots are open this week.', time: '3h ago', likes: 11 },
      { id: 2, text: 'Finished a great neighborhood loop with three active labs today.', time: '2 days ago', likes: 17 },
    ],
    reviews: [
      { id: 1, author: 'Marta S.', rating: 5, text: 'Miguel is dependable and my dog comes back calm and tired every time.', time: '2 weeks ago' },
      { id: 2, author: 'Filipe R.', rating: 4, text: 'Great communication and always on time.', time: '1 month ago' },
    ],
  },
  '3': {
    id: '3',
    name: 'Sara Mendes',
    username: '@saramendes',
    role: 'Pet Sitter',
    bio: 'Friendly sitter offering home visits, overnight stays, and consistent updates while you are away.',
    initials: 'SM',
    stats: [
      { value: '5.0', label: 'Rating' },
      { value: 31, label: 'Reviews' },
      { value: 76, label: 'Bookings' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since February 2022', '📍 Braga, PT', '⭐ Overnight care specialist', '💶 18€–24€ / day'] },
      { title: 'Pet Types', type: 'tags', items: ['Cats', 'Dogs', 'Small Pets'] },
    ],
    availability: {
      status: 'Accepting',
      location: 'Braga + 10 km',
      responseTime: '< 1 hour',
      capacity: '2 bookings/day',
      windows: [
        { label: 'Mon - Thu', time: '10:00 - 18:00' },
        { label: 'Friday', time: '10:00 - 16:00' },
        { label: 'Weekend', time: 'On request' },
      ],
      services: [
        { name: 'Pet Sitting', rate: '22 EUR', detail: 'Care and supervision while owners are away' },
        { name: 'Home Visits', rate: '16 EUR', detail: 'Feeding, playtime, and check-ins' },
        { name: 'Overnight Stay', rate: '48 EUR', detail: 'In-home overnight care' },
      ],
    },
    posts: [
      { id: 1, text: 'New overnight booking slot opened for next weekend.', time: '4h ago', likes: 8 },
      { id: 2, text: 'Just finished caring for two shy cats and earned their trust.', time: '1 day ago', likes: 21 },
    ],
    reviews: [
      { id: 1, author: 'Joana P.', rating: 5, text: 'Sara is calm, organized, and very caring with our pets.', time: '1 week ago' },
      { id: 2, author: 'Nuno F.', rating: 5, text: 'Great updates and excellent attention to detail.', time: '3 weeks ago' },
    ],
  },
  '5': {
    id: '5',
    name: 'João Silva',
    username: '@joaosilva',
    role: 'Cat Sitter',
    bio: 'Cat sitter who focuses on routine, calm handling, and detailed updates for every visit.',
    initials: 'JS',
    stats: [
      { value: '4.8', label: 'Rating' },
      { value: 19, label: 'Reviews' },
      { value: 53, label: 'Bookings' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since July 2022', '📍 Porto, PT', '🐈 Cat care focused', '💶 14€–20€ / day'] },
      { title: 'Pet Types', type: 'tags', items: ['Cats', 'Kittens', 'Senior Cats'] },
    ],
    availability: {
      status: 'Accepting',
      location: 'Porto + 5 km',
      responseTime: '< 1 hour',
      capacity: '3 bookings/day',
      windows: [
        { label: 'Mon - Fri', time: '08:30 - 14:30' },
        { label: 'Saturday', time: '10:00 - 14:00' },
        { label: 'Sunday', time: 'On request' },
      ],
      services: [
        { name: 'Cat Sitting', rate: '18 EUR', detail: 'Feeding, litter care, and companionship' },
        { name: 'Home Visits', rate: '14 EUR', detail: 'Short check-ins for cats at home' },
      ],
    },
    posts: [
      { id: 1, text: 'Daily cat care slots now open for the coming week.', time: '5h ago', likes: 6 },
      { id: 2, text: 'Spent the morning helping a nervous kitten settle in.', time: '2 days ago', likes: 15 },
    ],
    reviews: [
      { id: 1, author: 'Inês R.', rating: 5, text: 'João is patient and my cats warmed up to him quickly.', time: '2 weeks ago' },
      { id: 2, author: 'Pedro L.', rating: 5, text: 'Very reliable and detailed with updates.', time: '1 month ago' },
    ],
  },
  '6': {
    id: '6',
    name: 'Rui Faria',
    username: '@ruifaria',
    role: 'Dog Sitter',
    bio: 'Calm dog sitter for walks, feeding, and overnight care with a steady routine.',
    initials: 'RF',
    stats: [
      { value: '4.6', label: 'Rating' },
      { value: 14, label: 'Reviews' },
      { value: 40, label: 'Bookings' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since October 2022', '📍 Porto, PT', '🐕 Calm handling', '💶 13€–19€ / day'] },
      { title: 'Pet Types', type: 'tags', items: ['Dogs', 'Puppies', 'Senior Dogs'] },
    ],
    availability: {
      status: 'Accepting',
      location: 'Porto + 9 km',
      responseTime: '< 2 hours',
      capacity: '2 bookings/day',
      windows: [
        { label: 'Mon - Fri', time: '09:00 - 17:00' },
        { label: 'Saturday', time: '10:00 - 15:00' },
        { label: 'Sunday', time: 'On request' },
      ],
      services: [
        { name: 'Dog Sitting', rate: '19 EUR', detail: 'Daily care, feeding, and playtime' },
        { name: 'Dog Walking', rate: '13 EUR', detail: 'Leisure and exercise walks' },
      ],
    },
    posts: [
      { id: 1, text: 'Taking bookings for relaxed and senior dogs this month.', time: '8h ago', likes: 4 },
      { id: 2, text: 'Finished a great afternoon with a rescue pup learning to trust again.', time: '3 days ago', likes: 12 },
    ],
    reviews: [
      { id: 1, author: 'Sara M.', rating: 5, text: 'Rui is steady, kind, and very attentive.', time: '2 weeks ago' },
      { id: 2, author: 'Ana P.', rating: 4, text: 'Clear communication and dependable care.', time: '1 month ago' },
    ],
  },
  '7': {
    id: '7',
    name: 'Inês Sousa',
    username: '@inessousa',
    role: 'Cat Walker',
    bio: 'Cat walker and visitor with a gentle approach for shy, anxious, or elderly cats.',
    initials: 'IS',
    stats: [
      { value: '4.5', label: 'Rating' },
      { value: 11, label: 'Reviews' },
      { value: 28, label: 'Bookings' },
    ],
    sidebarCards: [
      { title: 'About', type: 'meta', items: ['📅 Member since April 2023', '📍 Lisbon, PT', '🐈 Gentle cat visits', '💶 10€–16€ / visit'] },
      { title: 'Pet Types', type: 'tags', items: ['Cats', 'Kittens', 'Anxious Cats'] },
    ],
    availability: {
      status: 'Accepting',
      location: 'Lisbon + 4 km',
      responseTime: '< 1 hour',
      capacity: '4 bookings/day',
      windows: [
        { label: 'Mon - Fri', time: '08:00 - 12:00' },
        { label: 'Saturday', time: '10:00 - 13:00' },
        { label: 'Sunday', time: 'On request' },
      ],
      services: [
        { name: 'Cat Visits', rate: '12 EUR', detail: 'Feeding, litter, and companionship visits' },
        { name: 'Home Check-ins', rate: '10 EUR', detail: 'Short house visits for cats at home' },
      ],
    },
    posts: [
      { id: 1, text: 'Opened a few more cat visit slots for next week.', time: '6h ago', likes: 5 },
      { id: 2, text: 'Spent the morning with a very shy tabby who finally came out to greet me.', time: '2 days ago', likes: 10 },
    ],
    reviews: [
      { id: 1, author: 'Filipe S.', rating: 5, text: 'Inês was patient and gentle with our shy cat.', time: '3 weeks ago' },
      { id: 2, author: 'Marta C.', rating: 4, text: 'Very kind and dependable.', time: '1 month ago' },
    ],
  },
};

export function getOwnerProfile(profileId?: string) {
  return ownerProfiles[profileId ?? currentOwnerProfileId] ?? ownerProfiles[currentOwnerProfileId];
}

export function getSitterProfile(profileId?: string) {
  return sitterProfiles[profileId ?? currentSitterProfileId] ?? sitterProfiles[currentSitterProfileId];
}

export const searchProfiles: SearchProfile[] = [
  { id: '1', name: 'Ana Costa', role: 'Cat Sitter', location: 'Porto, PT', rating: '4.9', profileType: 'sitter' },
  { id: '2', name: 'Miguel Reis', role: 'Dog Walker', location: 'Lisbon, PT', rating: '4.7', profileType: 'sitter' },
  { id: '3', name: 'Sara Mendes', role: 'Pet Sitter', location: 'Braga, PT', rating: '5.0', profileType: 'sitter' },
  { id: '4', name: 'Jane Doe', role: 'Pet Owner', location: 'Porto, PT', profileType: 'owner' },
  { id: '5', name: 'João Silva', role: 'Cat Sitter', location: 'Porto, PT', rating: '4.8', profileType: 'sitter' },
  { id: '6', name: 'Rui Faria', role: 'Dog Sitter', location: 'Porto, PT', rating: '4.6', profileType: 'sitter' },
  { id: '7', name: 'Inês Sousa', role: 'Cat Walker', location: 'Lisbon, PT', rating: '4.5', profileType: 'sitter' },
  { id: '8', name: 'John Smith', role: 'Pet Owner', location: 'Lisbon, PT', profileType: 'owner' },
];
