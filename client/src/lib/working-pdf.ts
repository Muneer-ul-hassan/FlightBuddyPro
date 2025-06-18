import { FlightBookingForm } from "@shared/schema";

export function generateWorkingPDF(formData: FlightBookingForm): void {
  // Generate PNR
  const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Create HTML content for the e-ticket
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>E-Ticket ${pnr}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        .header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .pnr { font-size: 14px; font-weight: bold; margin: 10px 0; }
        .section { margin: 15px 0; }
        .section-title { font-size: 14px; font-weight: bold; margin-bottom: 8px; }
        .passenger-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .passenger-table th, .passenger-table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        .passenger-table th { background-color: #f0f0f0; font-weight: bold; }
        .flight-box { border: 1px solid #ccc; padding: 10px; margin: 10px 0; background-color: #f9f9f9; }
        .route { font-size: 14px; font-weight: bold; margin-bottom: 5px; }
        .important { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 15px 0; font-weight: bold; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">ELECTRONIC TICKET</div>
    <div>Issued on: ${new Date().toLocaleDateString('en-GB')}</div>
    <div class="pnr">Booking Reference (PNR): ${pnr}</div>
    
    <div class="section">
        <div class="section-title">Passenger(s) Information</div>
        <table class="passenger-table">
            <tr>
                <th>Passenger Name</th>
                <th>Baggage Limit</th>
                <th>e-Ticket Number</th>
            </tr>
            ${formData.passengers.map((passenger, index) => {
              const nameUpper = passenger.name.toUpperCase().replace(' ', '/');
              const title = index === 0 ? 'Mr.' : 'Ms.';
              const baggage = passenger.baggage || [];
              let baggageText = '';
              if (baggage.includes('carry')) baggageText += '1x 7kg Hand baggage<br>';
              if (baggage.includes('checked')) baggageText += '1x 25kg Checked baggage<br>';
              if (baggage.includes('personal')) baggageText += '1x Personal Bag included<br>';
              if (baggage.length === 0) baggageText = '1x Personal Bag included';
              
              return `
                <tr>
                    <td><strong>${nameUpper} ${title}</strong></td>
                    <td>${baggageText}</td>
                    <td>${passenger.eTicketNumber}</td>
                </tr>
              `;
            }).join('')}
        </table>
    </div>
    
    <div class="important">
        IMPORTANT: PLEASE ENSURE YOU CHECK YOUR EMAILS RECEIVED FROM THE AIRLINE
        OR FROM THE TRAVEL AGENCY REGARDING ANY CHANGES OR CANCELLATIONS AND
        STAY AWARE OF ANY CHANGES IN THE SCHEDULE MADE BY THE AIRLINE. YOU CAN
        ALWAYS VERIFY YOUR TRAVEL DETAILS FROM THE AIRLINE WEBSITE.
    </div>
    
    <div class="section">
        ${formData.flightSegments.map(segment => {
          const date = new Date(segment.date);
          const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const formattedDate = `${days[date.getDay()]} ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]}`;
          
          return `
            <div class="route">${segment.from} – ${segment.to}</div>
            <div class="flight-box">
                <div><strong>Flight ${segment.flightNumber}</strong></div>
                <div>Operated By ${segment.airline}</div>
                <div>Departure ${formattedDate} ${segment.departureTime} ${segment.from} Airport</div>
                <div>Arrival   ${formattedDate} ${segment.arrivalTime} ${segment.to} Airport</div>
            </div>
          `;
        }).join('')}
    </div>
    
    <div style="margin-top: 30px; font-size: 10px; color: #666;">
        This is a computer-generated e-ticket. Please keep this document for your records.<br>
        For any inquiries, please contact customer service with your booking reference number.
    </div>
</body>
</html>`;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print dialog
    setTimeout(() => {
      printWindow.print();
      // Auto-close after printing (optional)
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  } else {
    // Fallback: create downloadable HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-ticket-${pnr}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}