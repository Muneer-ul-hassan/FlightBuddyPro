import { FlightBookingForm } from "@shared/schema";

declare global {
  interface Window {
    jsPDF: any;
  }
}

async function loadJsPDF(): Promise<void> {
  if (window.jsPDF) return;
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    
    script.onload = () => {
      // Wait a bit for the library to initialize
      setTimeout(() => {
        if (window.jsPDF && typeof window.jsPDF.jsPDF === 'function') {
          resolve();
        } else {
          reject(new Error('jsPDF failed to initialize'));
        }
      }, 100);
    };
    
    script.onerror = () => reject(new Error('Failed to load jsPDF script'));
    
    document.head.appendChild(script);
    
    // Timeout after 15 seconds
    setTimeout(() => reject(new Error('jsPDF loading timeout')), 15000);
  });
}

export async function generatePDF(formData: FlightBookingForm): Promise<void> {
  try {
    // Load jsPDF with better error handling
    await loadJsPDF();
    
    // Check if jsPDF is properly loaded
    if (!window.jsPDF || typeof window.jsPDF.jsPDF !== 'function') {
      throw new Error('jsPDF library failed to load properly');
    }

    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();
    
    // Set up the document
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 6;
    
    // Helper function to add text
    const addText = (text: string, x: number, y: number, fontSize: number = 10, fontStyle: string = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      doc.text(text, x, y);
      return y + lineHeight + (fontSize > 12 ? 2 : 0);
    };

    // Helper function to format date
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${days[date.getDay()]} ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]}`;
    };

    // Generate booking reference (PNR style)
    const bookingRef = Array.from({length: 2}, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('') + Math.floor(Math.random() * 90 + 10) + 
    Array.from({length: 2}, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');
    
    // Header
    doc.setTextColor(0, 0, 0);
    yPos = addText('ELECTRONIC TICKET', margin, yPos, 18, 'bold');
    yPos += 5;
    yPos = addText(`Issued on: ${new Date().toLocaleDateString('en-GB')}`, margin, yPos, 10);
    yPos += 15;
    
    // Booking Reference
    yPos = addText(`Booking Reference (PNR): ${bookingRef}`, margin, yPos, 12, 'bold');
    yPos += 15;
    
    // Passenger Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 15, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 15);
    
    yPos = addText('Passenger(s) Name', margin + 2, yPos + 5, 10, 'bold');
    addText('Baggage Limit', margin + 70, yPos - 6, 10, 'bold');
    addText('e-Ticket Number', margin + 130, yPos - 6, 10, 'bold');
    yPos += 10;
    
    // Passenger Details
    formData.passengers.forEach((passenger, index) => {
      const rowHeight = 35;
      
      // Draw row border
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), rowHeight);
      
      // Passenger name
      const nameUpper = passenger.name.toUpperCase().replace(' ', '/');
      const title = index === 0 ? 'Mr.' : 'Ms.';
      yPos = addText(`${nameUpper} ${title}`, margin + 2, yPos + 5, 10, 'bold');
      
      // Baggage details
      let baggageY = yPos - 6;
      const baggageList = passenger.baggage || [];
      if (baggageList.includes('carry')) {
        baggageY = addText('1x 7kg Hand baggage', margin + 70, baggageY, 9);
      }
      if (baggageList.includes('checked')) {
        baggageY = addText('1x 25kg Checked baggage', margin + 70, baggageY, 9);
      }
      if (baggageList.includes('personal')) {
        baggageY = addText('1x Personal Bag included', margin + 70, baggageY, 9);
      }
      if (baggageList.length === 0) {
        baggageY = addText('1x Personal Bag included', margin + 70, baggageY, 9);
      }
      
      // E-ticket number
      addText(passenger.eTicketNumber, margin + 130, yPos - 1, 10);
      
      yPos += rowHeight;
    });
    
    yPos += 10;
    
    // Important notice
    doc.setFillColor(255, 255, 200);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 35, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 35);
    
    yPos += 8;
    yPos = addText('IMPORTANT: PLEASE ENSURE YOU CHECK YOUR EMAILS RECEIVED FROM THE AIRLINE', margin + 5, yPos, 9, 'bold');
    yPos = addText('OR FROM THE TRAVEL AGENCY REGARDING ANY CHANGES OR CANCELLATIONS AND', margin + 5, yPos, 9, 'bold');
    yPos = addText('STAY AWARE OF ANY CHANGES IN THE SCHEDULE MADE BY THE AIRLINE. YOU CAN', margin + 5, yPos, 9, 'bold');
    yPos = addText('ALWAYS VERIFY YOUR TRAVEL DETAILS FROM THE AIRLINE WEBSITE.', margin + 5, yPos, 9, 'bold');
    yPos += 15;
    
    // Flight segments
    formData.flightSegments.forEach((segment, index) => {
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      
      // Route header
      yPos = addText(`${segment.from} – ${segment.to}`, margin, yPos, 14, 'bold');
      yPos += 8;
      
      // Flight details box
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 45, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin, yPos - 5, pageWidth - (margin * 2), 45);
      
      yPos = addText(`Flight ${segment.flightNumber}`, margin + 5, yPos + 5, 12, 'bold');
      yPos = addText(`Operated By ${segment.airline}`, margin + 5, yPos, 10);
      yPos += 5;
      
      const formattedDate = formatDate(segment.date);
      yPos = addText(`Departure ${formattedDate} ${segment.departureTime} ${segment.from} Airport`, margin + 5, yPos, 10);
      yPos = addText(`Arrival   ${formattedDate} ${segment.arrivalTime} ${segment.to} Airport`, margin + 5, yPos, 10);
      yPos += 15;
    });
    
    // Footer
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated e-ticket. Please keep this document for your records.', margin, yPos);
    doc.text('For any inquiries, please contact customer service with your booking reference number.', margin, yPos + 8);
    
    // Save the PDF
    doc.save(`e-ticket-${bookingRef}.pdf`);
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
