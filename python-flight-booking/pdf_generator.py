from reportlab.lib.pagesizes import A4, letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from io import BytesIO
import os
from models import FlightBooking, BrandingOptions

class PDFGenerator:
    def __init__(self, branding: BrandingOptions = None):
        self.branding = branding or BrandingOptions()
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        # Custom styles for the e-ticket
        self.styles.add(ParagraphStyle(
            name='CompanyHeader',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=6,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#6B46C1')
        ))
        
        self.styles.add(ParagraphStyle(
            name='ETicketTitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1F2937')
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading3'],
            fontSize=12,
            spaceBefore=12,
            spaceAfter=6,
            textColor=colors.HexColor('#374151')
        ))
        
        self.styles.add(ParagraphStyle(
            name='BodyText',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=4
        ))
    
    def generate_eticket(self, booking: FlightBooking) -> BytesIO:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72,
                               topMargin=72, bottomMargin=18)
        
        story = []
        
        # Header with logo and company info
        story.extend(self._create_header())
        
        # E-ticket title and booking reference
        story.append(Paragraph("ELECTRONIC TICKET", self.styles['ETicketTitle']))
        story.append(Paragraph(f"<b>Booking Reference (PNR): {booking.booking_reference}</b>", 
                              self.styles['BodyText']))
        story.append(Spacer(1, 12))
        
        # Passenger information
        story.extend(self._create_passenger_section(booking.passengers))
        
        # Flight details
        story.extend(self._create_flight_section(booking.flight_segments))
        
        # Contact information
        story.extend(self._create_contact_section(booking))
        
        # Terms and conditions
        story.extend(self._create_terms_section())
        
        doc.build(story)
        buffer.seek(0)
        return buffer
    
    def _create_header(self):
        elements = []
        
        # Company logo if exists
        if self.branding.logo_path and os.path.exists(self.branding.logo_path):
            try:
                logo = Image(self.branding.logo_path, width=2*inch, height=0.8*inch)
                logo.hAlign = 'CENTER'
                elements.append(logo)
            except:
                pass
        
        # Company name
        elements.append(Paragraph(self.branding.company_name, self.styles['CompanyHeader']))
        
        # Company details
        if self.branding.company_address:
            elements.append(Paragraph(self.branding.company_address, self.styles['BodyText']))
        
        contact_info = []
        if self.branding.company_phone:
            contact_info.append(f"Phone: {self.branding.company_phone}")
        if self.branding.company_email:
            contact_info.append(f"Email: {self.branding.company_email}")
        
        if contact_info:
            elements.append(Paragraph(" | ".join(contact_info), self.styles['BodyText']))
        
        elements.append(Spacer(1, 20))
        return elements
    
    def _create_passenger_section(self, passengers):
        elements = []
        elements.append(Paragraph("PASSENGER INFORMATION", self.styles['SectionHeader']))
        
        for i, passenger in enumerate(passengers, 1):
            passenger_data = [
                [f"Passenger {i}:", f"{passenger.title} {passenger.first_name} {passenger.last_name}"],
                ["Date of Birth:", passenger.date_of_birth.strftime("%d %b %Y")],
                ["Nationality:", passenger.nationality],
            ]
            
            if passenger.passport_number:
                passenger_data.append(["Passport:", passenger.passport_number])
            
            passenger_data.extend([
                ["Baggage:", passenger.baggage_allowance],
                ["Meal Preference:", passenger.meal_preference or "None"]
            ])
            
            table = Table(passenger_data, colWidths=[1.5*inch, 3*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F3F4F6')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            elements.append(table)
            elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_flight_section(self, segments):
        elements = []
        elements.append(Paragraph("FLIGHT DETAILS", self.styles['SectionHeader']))
        
        for i, segment in enumerate(segments, 1):
            flight_data = [
                ["Flight:", f"{segment.airline} {segment.flight_number}"],
                ["Route:", f"{segment.departure_city} → {segment.arrival_city}"],
                ["Departure:", f"{segment.departure_date.strftime('%d %b %Y')} at {segment.departure_time}"],
                ["Arrival:", f"{segment.arrival_date.strftime('%d %b %Y')} at {segment.arrival_time}"],
                ["Class:", segment.seat_class],
            ]
            
            if segment.aircraft_type:
                flight_data.append(["Aircraft:", segment.aircraft_type])
            if segment.fare_basis:
                flight_data.append(["Fare Basis:", segment.fare_basis])
            
            table = Table(flight_data, colWidths=[1.5*inch, 3*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#EEF2FF')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#C7D2FE')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            elements.append(table)
            elements.append(Spacer(1, 12))
        
        return elements
    
    def _create_contact_section(self, booking):
        elements = []
        elements.append(Paragraph("CONTACT INFORMATION", self.styles['SectionHeader']))
        
        contact_data = [
            ["Contact Person:", booking.contact_name],
            ["Email:", booking.contact_email],
            ["Phone:", booking.contact_phone],
        ]
        
        if booking.emergency_contact_name:
            contact_data.append(["Emergency Contact:", booking.emergency_contact_name])
        if booking.emergency_contact_phone:
            contact_data.append(["Emergency Phone:", booking.emergency_contact_phone])
        
        if booking.special_requests:
            contact_data.append(["Special Requests:", booking.special_requests])
        
        table = Table(contact_data, colWidths=[1.5*inch, 3*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_terms_section(self):
        elements = []
        elements.append(Paragraph("IMPORTANT INFORMATION", self.styles['SectionHeader']))
        
        terms = [
            "• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights",
            "• Valid photo identification is required for all passengers",
            "• Baggage allowances are subject to airline policies",
            "• Flight times and aircraft types may be subject to change",
            "• This e-ticket must be presented at check-in",
            "• For changes or cancellations, please contact your travel agent"
        ]
        
        for term in terms:
            elements.append(Paragraph(term, self.styles['BodyText']))
        
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"Generated on: {booking.created_at.strftime('%d %B %Y at %H:%M')}", 
                                 self.styles['BodyText']))
        
        return elements