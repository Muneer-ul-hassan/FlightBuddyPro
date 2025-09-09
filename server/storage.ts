import { flightBookings, type FlightBooking, type InsertFlightBooking } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createFlightBooking(booking: InsertFlightBooking): Promise<FlightBooking>;
  getFlightBooking(id: number): Promise<FlightBooking | undefined>;
  getAllFlightBookings(): Promise<FlightBooking[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private flightBookings: Map<number, FlightBooking>;
  private currentUserId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.flightBookings = new Map();
    this.currentUserId = 1;
    this.currentBookingId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFlightBooking(booking: InsertFlightBooking): Promise<FlightBooking> {
    const id = this.currentBookingId++;
    const flightBooking: FlightBooking = { 
      ...booking, 
      id,
      createdAt: new Date()
    };
    this.flightBookings.set(id, flightBooking);
    return flightBooking;
  }

  async getFlightBooking(id: number): Promise<FlightBooking | undefined> {
    return this.flightBookings.get(id);
  }

  async getAllFlightBookings(): Promise<FlightBooking[]> {
    return Array.from(this.flightBookings.values());
  }
}

export const storage = new MemStorage();
