// src/context/BookingContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Booking = {
  name: string;
  phone: string;
  date: string;
  time: string;
  design?: string;
  rating?: number;
  comment?: string;
};

type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  addReview: (index: number, rating: number, comment: string) => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const addReview = (index: number, rating: number, comment: string) => {
    setBookings((prev) =>
      prev.map((b, i) =>
        i === index ? { ...b, rating, comment } : b
      )
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, addReview }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be inside BookingProvider");
  }

  return context;
}