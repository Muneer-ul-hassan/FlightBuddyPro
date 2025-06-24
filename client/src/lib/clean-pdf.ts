import { FlightBookingForm } from "@shared/schema";

interface BrandingOptions {
  logoUrl?: string;
}

export function generateWorkingPDF(formData: FlightBookingForm, branding?: BrandingOptions): void {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for PDF generation.');
      return;
    }

  const generatePNR = () => Math.random().toString(36).substring(2, 8).toUpperCase();
  const pnr = generatePNR();
  
  // Company logo HTML
  const logoHtml = branding?.logoUrl ? `
    <div style="text-align: left; margin-bottom: 20px;">
      <img src="${branding.logoUrl}" alt="Company Logo" style="height: 60px; width: auto;">
    </div>
  ` : '';

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
            margin-bottom: 20px;
            min-height: 60px;
        }
        .logo {
            max-height: 40px;
            max-width: 200px;
            object-fit: contain;
        }
        .header { 
            text-align: center; 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 20px; 
            letter-spacing: 2px;
        }
        .booking-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 12px;
        }
        .booking-ref {
            font-weight: bold;
        }
        .issue-date {
            color: #666;
        }
        .flight-segment {
            border: 1px solid #000;
            margin-bottom: 15px;
            background: white;
        }
        .segment-header {
            background: #e8e8e8;
            padding: 8px 12px;
            font-weight: bold;
            font-size: 12px;
            border-bottom: 1px solid #000;
        }
        .segment-table {
            width: 100%;
            border-collapse: collapse;
        }
        .segment-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #ddd;
            vertical-align: top;
        }
        .segment-table .label {
            font-weight: bold;
            width: 120px;
            background: #f5f5f5;
        }
        .passenger-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
            margin-top: 20px;
        }
        .passenger-table th {
            background: #e8e8e8;
            padding: 8px;
            text-align: left;
            border: 1px solid #000;
            font-weight: bold;
            font-size: 11px;
        }
        .passenger-table td {
            padding: 8px;
            border: 1px solid #000;
            font-size: 11px;
            vertical-align: top;
        }
        .baggage-info {
            font-size: 10px;
            color: #000;
        }
        .important-info {
            margin-top: 20px;
            font-size: 10px;
            color: #000;
        }
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="logo-section">
        ${branding?.logoUrl ? `<img src="${branding.logoUrl}" alt="Company Logo" class="logo">` : ''}
    </div>
    
    <div class="header">ELECTRONIC TICKET</div>
    
    <div class="booking-info">
        <div class="booking-ref">Booking Reference (PNR): ${pnr}</div>
        <div class="issue-date">Issued on: ${new Date().toLocaleDateString('en-GB')}</div>
    </div>

    ${formData.flightSegments.map((segment, index) => `
        <div class="flight-segment">
            <div class="segment-header">
                ${segment.departureCity} – ${segment.arrivalCity}
            </div>
            <table class="segment-table">
                <tr>
                    <td class="label">Flight</td>
                    <td>${segment.flightNumber}</td>
                </tr>
                <tr>
                    <td class="label">Operated By</td>
                    <td>${segment.airline}</td>
                </tr>
                <tr>
                    <td class="label">Departure</td>
                    <td>${segment.departureDate.split('-')[2]} ${new Date(segment.departureDate).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()} &nbsp;&nbsp;&nbsp; ${segment.departureTime} &nbsp;&nbsp;&nbsp; ${segment.departureCity}</td>
                </tr>
                <tr>
                    <td class="label">Arrival</td>
                    <td>${segment.arrivalDate.split('-')[2]} ${new Date(segment.arrivalDate).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()} &nbsp;&nbsp;&nbsp; ${segment.arrivalTime} &nbsp;&nbsp;&nbsp; ${segment.arrivalCity}</td>
                </tr>
            </table>
        </div>
    `).join('')}

    <table class="passenger-table">
        <thead>
            <tr>
                <th>Passenger (s) Name</th>
                <th>Baggage Limit</th>
                <th>E-Ticket Number</th>
            </tr>
        </thead>
        <tbody>
            ${formData.passengers.map((passenger, index) => `
                <tr>
                    <td>${passenger.firstName.toUpperCase()}/${passenger.lastName.toUpperCase()} ${passenger.title}.</td>
                    <td class="baggage-info">
                        1x 7kg Hand baggage<br>
                        1x Personal Bag included<br>
                        ${passenger.baggageQuantity || '1'}x ${passenger.baggageWeight || '23kg'} Checked baggage
                    </td>
                    <td>157-${Math.floor(Math.random() * 10000000000)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="important-info">
        <strong>IMPORTANT: PLEASE ENSURE YOU CHECK YOUR EMAILS RECEIVED FROM THE AIRLINE OR FROM THE TRAVEL AGENCY REGARDING ANY CHANGES, CANCELLATIONS AND STAY AWARE OF ANY CHANGES IN THE SCHEDULE MADE BY THE AIRLINE. YOU CAN ALWAYS VERIFY YOUR TRAVEL DETAILS FROM THE AIRLINE WEBSITE.</strong>
    </div>
</body>
</html>
  `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('PDF generation failed. Please try again.');
  }
}