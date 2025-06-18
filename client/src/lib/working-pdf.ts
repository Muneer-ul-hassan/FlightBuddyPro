import { FlightBookingForm } from "@shared/schema";

interface BrandingOptions {
  logoUrl?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export function generateWorkingPDF(formData: FlightBookingForm, branding?: BrandingOptions): void {
  // Generate PNR
  const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Create HTML content matching the exact structure from the sample
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>E-Ticket ${pnr}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 40px; 
            font-size: 11px; 
            line-height: 1.4;
            color: #000;
        }
        .logo-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            min-height: 60px;
        }
        .logo {
            max-height: 50px;
            max-width: 150px;
        }
        .company-info {
            text-align: right;
            font-size: 9px;
            line-height: 1.3;
        }
        .header { 
            text-align: center; 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 30px; 
            letter-spacing: 2px;
        }
        .issue-date { 
            text-align: right; 
            margin-bottom: 20px; 
            font-size: 11px;
        }
        .pnr-section { 
            margin-bottom: 40px; 
            font-size: 11px;
        }
        .flight-segment { 
            margin-bottom: 30px; 
            page-break-inside: avoid;
        }
        .route-title { 
            font-size: 12px; 
            font-weight: bold; 
            margin-bottom: 15px;
        }
        .flight-details { 
            margin-left: 0; 
            line-height: 1.6;
        }
        .flight-details div { 
            margin-bottom: 4px;
        }
        .passenger-section { 
            margin: 40px 0; 
            page-break-inside: avoid;
        }
        .passenger-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            font-size: 11px;
        }
        .passenger-table th { 
            border: 1px solid #000; 
            padding: 8px; 
            text-align: center; 
            font-weight: bold;
            background-color: #f8f8f8;
        }
        .passenger-table td { 
            border: 1px solid #000; 
            padding: 8px; 
            text-align: center; 
            vertical-align: middle;
        }
        .passenger-name { 
            font-weight: bold;
        }
        .baggage-details {
            font-size: 10px;
            line-height: 1.3;
        }
        .important-notice { 
            margin: 30px 0; 
            padding: 15px;
            background-color: #fff8dc;
            border: 1px solid #ddd;
            font-weight: bold; 
            font-size: 10px;
            text-align: justify;
            line-height: 1.4;
        }
        @media print { 
            body { margin: 20px; } 
            .important-notice { background-color: #f9f9f9 !important; }
        }
    </style>
</head>
<body>
    ${branding ? `
    <div class="logo-section">
        <div>
            ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="Company Logo" class="logo">` : ''}
        </div>
        <div class="company-info">
            ${branding.companyName ? `<strong>${branding.companyName}</strong><br>` : ''}
            ${branding.companyAddress ? `${branding.companyAddress}<br>` : ''}
            ${branding.companyPhone ? `Tel: ${branding.companyPhone}<br>` : ''}
            ${branding.companyEmail ? `Email: ${branding.companyEmail}` : ''}
        </div>
    </div>
    ` : ''}
    
    <div class="header">ELECTRONIC TICKET</div>
    <div class="issue-date">Issued on: ${new Date().toLocaleDateString('en-GB')}</div>
    
    <div class="pnr-section">
        <strong>Booking Reference (PNR): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${pnr}</strong>
    </div>
    
    <br><br>
    
    ${formData.flightSegments.map(segment => {
      const date = new Date(segment.date);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dayName = days[date.getDay()];
      const dayNum = date.getDate().toString().padStart(2, '0');
      const monthName = months[date.getMonth()];
      
      return `
        <div class="flight-segment">
            <div class="route-title">${segment.from} – ${segment.to}</div>
            <br>
            <div class="flight-details">
                <div><strong>Flight &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${segment.flightNumber}</strong></div>
                <br>
                <div><strong>Operated By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${segment.airline}</strong></div>
                <br>
                <div><strong>Departure &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${dayName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${dayNum} ${monthName} &nbsp;&nbsp;&nbsp;&nbsp;${segment.departureTime} &nbsp;&nbsp;&nbsp;${segment.from} Airport</strong></div>
                <br>
                <div><strong>Arrival &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${dayName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${dayNum} ${monthName} &nbsp;&nbsp;&nbsp;&nbsp;${segment.arrivalTime} &nbsp;&nbsp;&nbsp;${segment.to} Airport</strong></div>
            </div>
            <br><br>
        </div>
      `;
    }).join('')}
    
    <div class="passenger-section">
        <table class="passenger-table">
            <tr>
                <th style="width: 30%;">Passenger (s) Name</th>
                <th style="width: 40%;">Baggage Limit</th>
                <th style="width: 30%;">e-Ticket Number</th>
            </tr>
            ${formData.passengers.map((passenger, index) => {
              const nameUpper = passenger.name.toUpperCase().replace(' ', '/');
              const title = index === 0 ? 'Mr.' : 'Ms.';
              const baggage = passenger.baggage || [];
              
              let baggageLines = [];
              if (baggage.includes('carry')) baggageLines.push('1x 7kg Hand baggage');
              if (baggage.includes('checked')) baggageLines.push('1x 25kg Checked baggage');
              if (baggage.includes('personal')) baggageLines.push('1x Personal Bag included');
              if (baggage.length === 0) baggageLines.push('1x Personal Bag included');
              
              const baggageText = baggageLines.join('<br>');
              
              return `
                <tr>
                    <td class="passenger-name">${nameUpper} ${title}</td>
                    <td class="baggage-details">${baggageText}</td>
                    <td>${passenger.eTicketNumber}</td>
                </tr>
              `;
            }).join('')}
        </table>
    </div>
    
    <div class="important-notice">
        <strong>IMPORTANT: PLEASE ENSURE YOU CHECK YOUR EMAILS RECEIVED FROM THE AIRLINE<br>
        OR FROM THE TRAVEL AGENCY REGARDING ANY CHANGES OR CANCELLATIONS AND<br>
        STAY AWARE OF ANY CHANGES IN THE SCHEDULE MADE BY THE AIRLINE. YOU CAN<br>
        ALWAYS VERIFY YOUR TRAVEL DETAILS FROM THE AIRLINE WEBSITE.</strong>
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