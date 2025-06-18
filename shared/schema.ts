import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const flightBookings = pgTable("flight_bookings", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  flightSegments: jsonb("flight_segments").notNull(),
  passengers: jsonb("passengers").notNull(),
  paymentMethod: text("payment_method"),
  consentGiven: boolean("consent_given").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flightSegmentSchema = z.object({
  flightNumber: z.string().min(1, "Flight number is required"),
  airline: z.string().min(1, "Airline is required"),
  from: z.string().min(1, "Origin airport is required"),
  to: z.string().min(1, "Destination airport is required"),
  date: z.string().min(1, "Date is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
});

export const passengerSchema = z.object({
  name: z.string().min(1, "Passenger name is required"),
  eTicketNumber: z.string().min(1, "E-ticket number is required"),
  baggage: z.array(z.enum(["personal", "carry", "checked"])).default([]),
});

export const flightBookingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  flightSegmentCount: z.number().min(1).max(6),
  flightSegments: z.array(flightSegmentSchema).min(1).max(6),
  passengerCount: z.number().min(1).max(6),
  passengers: z.array(passengerSchema).min(1).max(6),
  paymentMethod: z.enum(["stripe", "paypal"]).optional(),
  consentGiven: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
});

export const insertFlightBookingSchema = createInsertSchema(flightBookings).omit({
  id: true,
  createdAt: true,
});

export type InsertFlightBooking = z.infer<typeof insertFlightBookingSchema>;
export type FlightBooking = typeof flightBookings.$inferSelect;
export type FlightSegment = z.infer<typeof flightSegmentSchema>;
export type Passenger = z.infer<typeof passengerSchema>;
export type FlightBookingForm = z.infer<typeof flightBookingSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
