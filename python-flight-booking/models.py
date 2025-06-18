from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime, date

class FlightSegment(BaseModel):
    departure_city: str
    arrival_city: str
    departure_date: date
    departure_time: str
    arrival_date: date
    arrival_time: str
    flight_number: str
    airline: str
    aircraft_type: Optional[str] = ""
    seat_class: str
    fare_basis: Optional[str] = ""

class Passenger(BaseModel):
    title: str
    first_name: str
    last_name: str
    date_of_birth: date
    nationality: str
    passport_number: Optional[str] = ""
    passport_expiry: Optional[date] = None
    baggage_allowance: str = "23kg"
    meal_preference: Optional[str] = "None"
    
    @validator('title')
    def validate_title(cls, v):
        allowed_titles = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']
        if v not in allowed_titles:
            raise ValueError(f'Title must be one of: {allowed_titles}')
        return v

class BrandingOptions(BaseModel):
    company_name: str = "THE BETTER FARE - Atypical Agency"
    company_address: Optional[str] = ""
    company_phone: Optional[str] = ""
    company_email: Optional[str] = ""
    logo_path: Optional[str] = "static/logo.png"

class FlightBooking(BaseModel):
    booking_reference: str
    contact_name: str
    contact_email: str
    contact_phone: str
    emergency_contact_name: Optional[str] = ""
    emergency_contact_phone: Optional[str] = ""
    flight_segments: List[FlightSegment]
    passengers: List[Passenger]
    special_requests: Optional[str] = ""
    created_at: datetime = datetime.now()
    
    @validator('flight_segments')
    def validate_segments(cls, v):
        if len(v) < 1 or len(v) > 6:
            raise ValueError('Must have 1-6 flight segments')
        return v
    
    @validator('passengers')
    def validate_passengers(cls, v):
        if len(v) < 1 or len(v) > 6:
            raise ValueError('Must have 1-6 passengers')
        return v