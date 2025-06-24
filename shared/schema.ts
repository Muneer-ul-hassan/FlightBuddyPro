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
  title: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  baggageQuantity: z.string().optional(),
  baggageWeight: z.string().optional(),
  handBaggageQuantity: z.string().optional(),
  handBaggageWeight: z.string().optional(),
  personalBagQuantity: z.string().optional(),
  personalBagWeight: z.string().optional(),
  mealPreference: z.string().optional(),
});

export const flightBookingSchema = z.object({
  contactName: z.string().default("Travel Agency Contact"),
  contactEmail: z.string().default("contact@agency.com"),
  contactPhone: z.string().default("+1-555-0123"),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  flightSegments: z.array(flightSegmentSchema).optional(),
  passengers: z.array(passengerSchema).optional(),
  specialRequests: z.string().optional(),
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
