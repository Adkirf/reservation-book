
1. Required files:
reservation-book/
├── src/
│   ├── app/
│   │   ├── confirmation/
│   │   │   └── [id]/
│   │   │       └── page.tsx  (New file for dynamic route)
│   ├── components/
│   │   ├── ConfirmationCard.tsx  (Existing, to be modified)
│   │   ├── DaySwiper.tsx  (Existing, to be modified)
│   ├── contexts/
│   │   └── ReservationProvider.tsx  (Existing, may need modification)
│   ├── lib/
│   │   ├── firebase/
│   │   │   └── firestore.ts  (Existing, may need new query function)
│   │   └── utils.ts  (Existing, may need new utility functions)
│   └── hooks/
│       └── useReservation.ts  (New hook for fetching single reservation)

2. Existing files to be modified: