from flask import Flask, render_template, request, jsonify, send_file
from models import FlightBooking, FlightSegment, Passenger, BrandingOptions
from pdf_generator import PDFGenerator
import random
import string
from datetime import datetime
import os

app = Flask(__name__)

# In-memory storage for bookings
bookings = {}

def generate_booking_reference():
    """Generate a random 6-character booking reference"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/booking', methods=['POST'])
def create_booking():
    try:
        data = request.json
        
        # Generate booking reference
        booking_ref = generate_booking_reference()
        
        # Parse flight segments
        segments = []
        for seg in data.get('flight_segments', []):
            segment = FlightSegment(**seg)
            segments.append(segment)
        
        # Parse passengers
        passengers = []
        for pass_data in data.get('passengers', []):
            passenger = Passenger(**pass_data)
            passengers.append(passenger)
        
        # Create booking
        booking_data = {
            'booking_reference': booking_ref,
            'contact_name': data.get('contact_name'),
            'contact_email': data.get('contact_email'),
            'contact_phone': data.get('contact_phone'),
            'emergency_contact_name': data.get('emergency_contact_name', ''),
            'emergency_contact_phone': data.get('emergency_contact_phone', ''),
            'flight_segments': segments,
            'passengers': passengers,
            'special_requests': data.get('special_requests', ''),
        }
        
        booking = FlightBooking(**booking_data)
        bookings[booking_ref] = booking
        
        return jsonify({
            'success': True,
            'booking_reference': booking_ref,
            'message': 'Booking created successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/booking/<booking_ref>/pdf')
def generate_pdf(booking_ref):
    try:
        if booking_ref not in bookings:
            return jsonify({'error': 'Booking not found'}), 404
        
        booking = bookings[booking_ref]
        
        # Get branding options (you can extend this to accept from form)
        branding = BrandingOptions()
        
        # Generate PDF
        pdf_generator = PDFGenerator(branding)
        pdf_buffer = pdf_generator.generate_eticket(booking)
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f'eticket_{booking_ref}.pdf',
            mimetype='application/pdf'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings')
def get_bookings():
    """Get all bookings (for testing)"""
    booking_list = []
    for ref, booking in bookings.items():
        booking_list.append({
            'booking_reference': ref,
            'contact_name': booking.contact_name,
            'contact_email': booking.contact_email,
            'created_at': booking.created_at.isoformat(),
            'passenger_count': len(booking.passengers),
            'segment_count': len(booking.flight_segments)
        })
    return jsonify(booking_list)

if __name__ == '__main__':
    # Create static directory for logo
    os.makedirs('static', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=8000)