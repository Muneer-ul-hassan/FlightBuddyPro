import { FlightBookingForm } from "@shared/schema";

declare global {
  interface Window {
    jsPDF: any;
  }
}

export async function generateSimplePDF(formData: FlightBookingForm): Promise<void> {
  try {
    // Load jsPDF from a reliable CDN
    if (!window.jsPDF) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js';
        script.onload = () => {
          setTimeout(() => {
            if (window.jsPDF && window.jsPDF.jsPDF) {
              resolve();
            } else {
              reject(new Error('jsPDF not loaded'));
            }
          }, 500);
        };
        script.onerror = () => reject(new Error('Script load failed'));
        document.head.appendChild(script);
      });
    }

    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();
    
    let y = 20;
    const margin = 20;
    
    // Simple text function
    const addText = (text: string, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');
      doc.text(text, margin, y);
      y += fontSize > 12 ? 8 : 6;
    };

    // Generate PNR
    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Document content
    addText('ELECTRONIC TICKET', 18, true);
    y += 5;
    addText(`Issued on: ${new Date().toLocaleDateString()}`, 10);
    y += 5;
    addText(`Booking Reference (PNR): ${pnr}`, 14, true);
    y += 10;
    
    // Personal Info
    addText('PASSENGER INFORMATION', 14, true);
    formData.passengers.forEach((passenger, i) => {
      addText(`${i + 1}. ${passenger.name.toUpperCase()}`, 12, true);
      addText(`   E-Ticket: ${passenger.eTicketNumber}`, 10);
      if (passenger.baggage && passenger.baggage.length > 0) {
        const baggage = passenger.baggage.map(b => {
          if (b === 'personal') return 'Personal Bag';
          if (b === 'carry') return 'Hand Carry (7kg)';
          if (b === 'checked') return 'Checked Bag (25kg)';
          return b;
        }).join(', ');
        addText(`   Baggage: ${baggage}`, 10);
      }
      y += 3;
    });
    
    y += 10;
    
    // Flight Info
    addText('FLIGHT INFORMATION', 14, true);
    formData.flightSegments.forEach((segment, i) => {
      addText(`${segment.from} → ${segment.to}`, 12, true);
      addText(`Flight ${segment.flightNumber} - ${segment.airline}`, 11);
      addText(`Date: ${segment.date}`, 10);
      addText(`Departure: ${segment.departureTime} | Arrival: ${segment.arrivalTime}`, 10);
      y += 5;
    });
    
    y += 15;
    
    // Important notice
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT: Please check your emails for any flight changes.', margin, y);
    y += 5;
    doc.text('Always verify details on the airline website.', margin, y);
    
    // Save
    doc.save(`e-ticket-${pnr}.pdf`);
    
  } catch (error) {
    console.error('PDF Error:', error);
    throw new Error('PDF generation failed. Please try again.');
  }
}