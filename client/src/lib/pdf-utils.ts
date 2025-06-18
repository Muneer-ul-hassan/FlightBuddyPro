import { FlightBookingForm } from "@shared/schema";

declare global {
  interface Window {
    jsPDF: any;
  }
}

export async function generatePDF(formData: FlightBookingForm): Promise<void> {
  // Dynamically load jsPDF
  if (!window.jsPDF) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
    
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }

  const { jsPDF } = window.jsPDF;
  const doc = new jsPDF();
  
  // Set up the document
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 8;
  
  // Helper function to add text with proper line breaks
  const addText = (text: string, x: number, y: number, fontSize: number = 12, fontStyle: string = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.text(text, x, y);
    return y + lineHeight + (fontSize > 12 ? 4 : 0);
  };
  
  // Header
  doc.setFillColor(25, 118, 210); // airline-blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  yPos = addText('FLIGHT BOOKING CONFIRMATION', margin, 25, 20, 'bold');
  
  doc.setTextColor(0, 0, 0);
  yPos = 50;
  
  // Booking reference
  const bookingRef = `FB-${Date.now()}`;
  yPos = addText(`Booking Reference: ${bookingRef}`, margin, yPos, 14, 'bold');
  yPos = addText(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos, 12);
  yPos += 10;
  
  // Personal Information Section
  yPos = addText('PERSONAL INFORMATION', margin, yPos, 16, 'bold');
  yPos += 5;
  yPos = addText(`Name: ${formData.fullName}`, margin + 5, yPos);
  yPos = addText(`Email: ${formData.email}`, margin + 5, yPos);
  yPos = addText(`Phone: ${formData.phone}`, margin + 5, yPos);
  yPos += 10;
  
  // Flight Information Section
  yPos = addText('FLIGHT INFORMATION', margin, yPos, 16, 'bold');
  yPos += 5;
  
  formData.flightSegments.forEach((segment, index) => {
    yPos = addText(`Flight Segment ${index + 1}`, margin + 5, yPos, 14, 'bold');
    yPos = addText(`Flight Number: ${segment.flightNumber}`, margin + 10, yPos);
    yPos = addText(`Airline: ${segment.airline}`, margin + 10, yPos);
    yPos = addText(`Route: ${segment.from} → ${segment.to}`, margin + 10, yPos);
    yPos = addText(`Date: ${segment.date}`, margin + 10, yPos);
    yPos = addText(`Departure: ${segment.departureTime} | Arrival: ${segment.arrivalTime}`, margin + 10, yPos);
    yPos += 5;
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  yPos += 5;
  
  // Passenger Information Section
  yPos = addText('PASSENGER INFORMATION', margin, yPos, 16, 'bold');
  yPos += 5;
  
  formData.passengers.forEach((passenger, index) => {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos = addText(`Passenger ${index + 1}`, margin + 5, yPos, 14, 'bold');
    yPos = addText(`Name: ${passenger.name}`, margin + 10, yPos);
    yPos = addText(`E-Ticket Number: ${passenger.eTicketNumber}`, margin + 10, yPos);
    
    if (passenger.baggage && passenger.baggage.length > 0) {
      const baggageText = passenger.baggage.map(b => {
        switch(b) {
          case 'personal': return 'Personal Bag';
          case 'carry': return 'Hand Carry';
          case 'checked': return 'Checked Bag';
          default: return b;
        }
      }).join(', ');
      yPos = addText(`Baggage: ${baggageText}`, margin + 10, yPos);
    }
    yPos += 5;
  });
  
  // Payment Method (if selected)
  if (formData.paymentMethod) {
    yPos += 5;
    yPos = addText('PAYMENT INFORMATION', margin, yPos, 16, 'bold');
    yPos += 5;
    const paymentText = formData.paymentMethod === 'stripe' ? 'Credit/Debit Card (Stripe)' : 'PayPal';
    yPos = addText(`Payment Method: ${paymentText}`, margin + 5, yPos);
  }
  
  // Footer
  yPos += 20;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a computer-generated booking confirmation. Please keep this document for your records.', margin, yPos);
  doc.text('For any inquiries, please contact customer service with your booking reference number.', margin, yPos + 8);
  
  // Save the PDF
  doc.save(`flight-booking-${bookingRef}.pdf`);
}
