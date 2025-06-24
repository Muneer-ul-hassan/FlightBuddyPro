from flask import Flask, render_template, request, jsonify, send_file
import random
import string
from datetime import datetime
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO

app = Flask(__name__)

# In-memory storage for bookings
bookings = {}

def generate_booking_reference():
    """Generate a random 6-character booking reference"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def generate_pdf(booking_data, booking_ref):
    """Generate PDF matching the exact layout from screenshot"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=72)
    
    story = []
    styles = getSampleStyleSheet()
    
    # Logo section
    if os.path.exists('static/logo.png'):
        try:
            logo = Image('static/logo.png', width=1.5*inch, height=0.6*inch)
            logo.hAlign = 'LEFT'
            story.append(logo)
            story.append(Spacer(1, 20))
        except:
            pass
    
    # Electronic Ticket title
    title_style = styles['Title'].clone('title_style')
    title_style.fontSize = 18
    title_style.alignment = TA_CENTER
    story.append(Paragraph("ELECTRONIC TICKET", title_style))
    story.append(Spacer(1, 10))
    
    # Booking reference and issue date
    ref_data = [
        [f"Booking Reference (PNR): {booking_ref}", f"Issued on: {datetime.now().strftime('%d-%m-%Y')}"]
    ]
    ref_table = Table(ref_data, colWidths=[3*inch, 2*inch])
    ref_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
    ]))
    story.append(ref_table)
    story.append(Spacer(1, 20))
    
    # Flight segments
    for segment in booking_data.get('flight_segments', []):
        # Segment header
        header_data = [[f"{segment['departure_city']} – {segment['arrival_city']}"]]
        header_table = Table(header_data, colWidths=[5*inch])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e8e8e8')),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(header_table)
        
        # Segment details
        dep_date = datetime.strptime(segment['departure_date'], '%Y-%m-%d')
        arr_date = datetime.strptime(segment['arrival_date'], '%Y-%m-%d')
        
        segment_data = [
            ["Flight", segment['flight_number']],
            ["Operated By", segment['airline']],
            ["Departure", f"{dep_date.strftime('%d %b').upper()}   {segment['departure_time']}   {segment['departure_city']}"],
            ["Arrival", f"{arr_date.strftime('%d %b').upper()}   {segment['arrival_time']}   {segment['arrival_city']}"],
        ]
        
        segment_table = Table(segment_data, colWidths=[1.2*inch, 3.8*inch])
        segment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(segment_table)
        story.append(Spacer(1, 15))
    
    # Passenger table
    passenger_data = [["Passenger (s) Name", "Baggage Limit", "E-Ticket Number"]]
    
    for i, passenger in enumerate(booking_data.get('passengers', [])):
        baggage_info = f"1x 7kg Hand baggage\n1x Personal Bag included\n{passenger.get('baggage_quantity', '1')}x {passenger.get('baggage_weight', '23kg')} Checked baggage"
        eticket_number = f"157-{30946510045 + i}"
        passenger_name = f"{passenger['first_name'].upper()}/{passenger['last_name'].upper()} {passenger['title']}."
        
        passenger_data.append([passenger_name, baggage_info, eticket_number])
    
    passenger_table = Table(passenger_data, colWidths=[2.5*inch, 2*inch, 1.5*inch])
    passenger_table.setStyle(TableStyle([
        # Header row
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e8e8e8')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        
        # Data rows
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        
        # All cells
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(passenger_table)
    story.append(Spacer(1, 20))
    
    # Important information
    important_text = """IMPORTANT: PLEASE ENSURE YOU CHECK YOUR EMAILS RECEIVED FROM THE AIRLINE OR FROM THE TRAVEL AGENCY REGARDING ANY CHANGES, CANCELLATIONS AND STAY AWARE OF ANY CHANGES IN THE SCHEDULE MADE BY THE AIRLINE. YOU CAN ALWAYS VERIFY YOUR TRAVEL DETAILS FROM THE AIRLINE WEBSITE."""
    
    important_style = styles['Normal'].clone('important_style')
    important_style.fontSize = 10
    story.append(Paragraph(f"<b>{important_text}</b>", important_style))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/booking', methods=['POST'])
def create_booking():
    try:
        data = request.json
        booking_ref = generate_booking_reference()
        
        # Store booking
        bookings[booking_ref] = data
        
        # Generate PDF
        pdf_buffer = generate_pdf(data, booking_ref)
        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f'eticket_{booking_ref}.pdf',
            mimetype='application/pdf'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    os.makedirs('static', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=8000)