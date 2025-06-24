import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FlightBookingForm } from "@shared/schema";
import { Plus, Minus } from "lucide-react";

interface FlightSegmentsSectionProps {
  form: UseFormReturn<FlightBookingForm>;
}

export default function FlightSegmentsSection({ form }: FlightSegmentsSectionProps) {
  const { watch, setValue } = form;
  const flightSegments = watch("flightSegments");

  const addSegment = () => {
    if (flightSegments.length < 6) {
      setValue("flightSegments", [
        ...flightSegments,
        {
          departureCity: "",
          arrivalCity: "",
          departureDate: "",
          departureTime: "",
          arrivalDate: "",
          arrivalTime: "",
          flightNumber: "",
          airline: "",
          aircraftType: "",
          seatClass: "",
          fareBasis: "",
        },
      ]);
    }
  };

  const removeSegment = (index: number) => {
    if (flightSegments.length > 1) {
      const updatedSegments = flightSegments.filter((_, i) => i !== index);
      setValue("flightSegments", updatedSegments);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Flight Details</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSegment}
            disabled={flightSegments.length >= 6}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Segment
          </Button>
        </div>
      </div>

      {flightSegments.map((_, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Flight Segment {index + 1}</h4>
            {flightSegments.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeSegment(index)}
              >
                <Minus className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name={`flightSegments.${index}.departureCity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure City *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select departure airport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Karachi Jinnah International Airport (KHI)">Karachi - KHI (Jinnah International)</SelectItem>
                      <SelectItem value="Lahore Allama Iqbal International Airport (LHE)">Lahore - LHE (Allama Iqbal International)</SelectItem>
                      <SelectItem value="Islamabad International Airport (ISB)">Islamabad - ISB (International Airport)</SelectItem>
                      <SelectItem value="Peshawar Bacha Khan International Airport (PEW)">Peshawar - PEW (Bacha Khan International)</SelectItem>
                      <SelectItem value="Quetta Airport (UET)">Quetta - UET (Airport)</SelectItem>
                      <SelectItem value="Multan International Airport (MUX)">Multan - MUX (International Airport)</SelectItem>
                      <SelectItem value="Faisalabad International Airport (LYP)">Faisalabad - LYP (International Airport)</SelectItem>
                      <SelectItem value="Sialkot International Airport (SKT)">Sialkot - SKT (International Airport)</SelectItem>
                      <SelectItem value="Doha Hamad International Airport (DOH)">Doha - DOH (Hamad International)</SelectItem>
                      <SelectItem value="Dubai International Airport (DXB)">Dubai - DXB (International Airport)</SelectItem>
                      <SelectItem value="Abu Dhabi International Airport (AUH)">Abu Dhabi - AUH (International Airport)</SelectItem>
                      <SelectItem value="Sharjah International Airport (SHJ)">Sharjah - SHJ (International Airport)</SelectItem>
                      <SelectItem value="Kuwait International Airport (KWI)">Kuwait - KWI (International Airport)</SelectItem>
                      <SelectItem value="Muscat International Airport (MCT)">Muscat - MCT (International Airport)</SelectItem>
                      <SelectItem value="Bahrain International Airport (BAH)">Bahrain - BAH (International Airport)</SelectItem>
                      <SelectItem value="Riyadh King Khalid International Airport (RUH)">Riyadh - RUH (King Khalid International)</SelectItem>
                      <SelectItem value="Jeddah King Abdulaziz International Airport (JED)">Jeddah - JED (King Abdulaziz International)</SelectItem>
                      <SelectItem value="Dammam King Fahd International Airport (DMM)">Dammam - DMM (King Fahd International)</SelectItem>
                      <SelectItem value="London Heathrow Airport (LHR)">London - LHR (Heathrow)</SelectItem>
                      <SelectItem value="London Gatwick Airport (LGW)">London - LGW (Gatwick)</SelectItem>
                      <SelectItem value="Manchester Airport (MAN)">Manchester - MAN (Airport)</SelectItem>
                      <SelectItem value="Birmingham Airport (BHX)">Birmingham - BHX (Airport)</SelectItem>
                      <SelectItem value="Frankfurt Airport (FRA)">Frankfurt - FRA (Airport)</SelectItem>
                      <SelectItem value="Munich Airport (MUC)">Munich - MUC (Airport)</SelectItem>
                      <SelectItem value="Paris Charles de Gaulle Airport (CDG)">Paris - CDG (Charles de Gaulle)</SelectItem>
                      <SelectItem value="Amsterdam Schiphol Airport (AMS)">Amsterdam - AMS (Schiphol)</SelectItem>
                      <SelectItem value="Istanbul Airport (IST)">Istanbul - IST (Airport)</SelectItem>
                      <SelectItem value="Istanbul Sabiha Gokcen Airport (SAW)">Istanbul - SAW (Sabiha Gokcen)</SelectItem>
                      <SelectItem value="New York John F. Kennedy Airport (JFK)">New York - JFK (John F. Kennedy)</SelectItem>
                      <SelectItem value="New York Newark Airport (EWR)">New York - EWR (Newark)</SelectItem>
                      <SelectItem value="Los Angeles International Airport (LAX)">Los Angeles - LAX (International)</SelectItem>
                      <SelectItem value="Chicago O'Hare International Airport (ORD)">Chicago - ORD (O'Hare International)</SelectItem>
                      <SelectItem value="Toronto Pearson International Airport (YYZ)">Toronto - YYZ (Pearson International)</SelectItem>
                      <SelectItem value="Bangkok Suvarnabhumi Airport (BKK)">Bangkok - BKK (Suvarnabhumi)</SelectItem>
                      <SelectItem value="Singapore Changi Airport (SIN)">Singapore - SIN (Changi)</SelectItem>
                      <SelectItem value="Kuala Lumpur International Airport (KUL)">Kuala Lumpur - KUL (International)</SelectItem>
                      <SelectItem value="Hong Kong International Airport (HKG)">Hong Kong - HKG (International)</SelectItem>
                      <SelectItem value="Beijing Capital International Airport (PEK)">Beijing - PEK (Capital International)</SelectItem>
                      <SelectItem value="Shanghai Pudong International Airport (PVG)">Shanghai - PVG (Pudong International)</SelectItem>
                      <SelectItem value="Tokyo Narita International Airport (NRT)">Tokyo - NRT (Narita International)</SelectItem>
                      <SelectItem value="Tokyo Haneda Airport (HND)">Tokyo - HND (Haneda)</SelectItem>
                      <SelectItem value="Seoul Incheon International Airport (ICN)">Seoul - ICN (Incheon International)</SelectItem>
                      <SelectItem value="Delhi Indira Gandhi International Airport (DEL)">Delhi - DEL (Indira Gandhi International)</SelectItem>
                      <SelectItem value="Mumbai Chhatrapati Shivaji International Airport (BOM)">Mumbai - BOM (Chhatrapati Shivaji International)</SelectItem>
                      <SelectItem value="Bangalore Kempegowda International Airport (BLR)">Bangalore - BLR (Kempegowda International)</SelectItem>
                      <SelectItem value="Chennai International Airport (MAA)">Chennai - MAA (International Airport)</SelectItem>
                      <SelectItem value="Hyderabad Rajiv Gandhi International Airport (HYD)">Hyderabad - HYD (Rajiv Gandhi International)</SelectItem>
                      <SelectItem value="Kolkata Netaji Subhas Chandra Bose International Airport (CCU)">Kolkata - CCU (Netaji Subhas Chandra Bose International)</SelectItem>
                      <SelectItem value="Sydney Kingsford Smith Airport (SYD)">Sydney - SYD (Kingsford Smith)</SelectItem>
                      <SelectItem value="Melbourne Airport (MEL)">Melbourne - MEL (Airport)</SelectItem>
                      <SelectItem value="Brisbane Airport (BNE)">Brisbane - BNE (Airport)</SelectItem>
                      <SelectItem value="Auckland Airport (AKL)">Auckland - AKL (Airport)</SelectItem>
                      <SelectItem value="Johannesburg OR Tambo International Airport (JNB)">Johannesburg - JNB (OR Tambo International)</SelectItem>
                      <SelectItem value="Cairo International Airport (CAI)">Cairo - CAI (International Airport)</SelectItem>
                      <SelectItem value="Casablanca Mohammed V International Airport (CMN)">Casablanca - CMN (Mohammed V International)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`flightSegments.${index}.arrivalCity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival City *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select arrival airport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Karachi Jinnah International Airport (KHI)">Karachi - KHI (Jinnah International)</SelectItem>
                      <SelectItem value="Lahore Allama Iqbal International Airport (LHE)">Lahore - LHE (Allama Iqbal International)</SelectItem>
                      <SelectItem value="Islamabad International Airport (ISB)">Islamabad - ISB (International Airport)</SelectItem>
                      <SelectItem value="Peshawar Bacha Khan International Airport (PEW)">Peshawar - PEW (Bacha Khan International)</SelectItem>
                      <SelectItem value="Quetta Airport (UET)">Quetta - UET (Airport)</SelectItem>
                      <SelectItem value="Multan International Airport (MUX)">Multan - MUX (International Airport)</SelectItem>
                      <SelectItem value="Faisalabad International Airport (LYP)">Faisalabad - LYP (International Airport)</SelectItem>
                      <SelectItem value="Sialkot International Airport (SKT)">Sialkot - SKT (International Airport)</SelectItem>
                      <SelectItem value="Doha Hamad International Airport (DOH)">Doha - DOH (Hamad International)</SelectItem>
                      <SelectItem value="Dubai International Airport (DXB)">Dubai - DXB (International Airport)</SelectItem>
                      <SelectItem value="Abu Dhabi International Airport (AUH)">Abu Dhabi - AUH (International Airport)</SelectItem>
                      <SelectItem value="Sharjah International Airport (SHJ)">Sharjah - SHJ (International Airport)</SelectItem>
                      <SelectItem value="Kuwait International Airport (KWI)">Kuwait - KWI (International Airport)</SelectItem>
                      <SelectItem value="Muscat International Airport (MCT)">Muscat - MCT (International Airport)</SelectItem>
                      <SelectItem value="Bahrain International Airport (BAH)">Bahrain - BAH (International Airport)</SelectItem>
                      <SelectItem value="Riyadh King Khalid International Airport (RUH)">Riyadh - RUH (King Khalid International)</SelectItem>
                      <SelectItem value="Jeddah King Abdulaziz International Airport (JED)">Jeddah - JED (King Abdulaziz International)</SelectItem>
                      <SelectItem value="Dammam King Fahd International Airport (DMM)">Dammam - DMM (King Fahd International)</SelectItem>
                      <SelectItem value="London Heathrow Airport (LHR)">London - LHR (Heathrow)</SelectItem>
                      <SelectItem value="London Gatwick Airport (LGW)">London - LGW (Gatwick)</SelectItem>
                      <SelectItem value="Manchester Airport (MAN)">Manchester - MAN (Airport)</SelectItem>
                      <SelectItem value="Birmingham Airport (BHX)">Birmingham - BHX (Airport)</SelectItem>
                      <SelectItem value="Frankfurt Airport (FRA)">Frankfurt - FRA (Airport)</SelectItem>
                      <SelectItem value="Munich Airport (MUC)">Munich - MUC (Airport)</SelectItem>
                      <SelectItem value="Paris Charles de Gaulle Airport (CDG)">Paris - CDG (Charles de Gaulle)</SelectItem>
                      <SelectItem value="Amsterdam Schiphol Airport (AMS)">Amsterdam - AMS (Schiphol)</SelectItem>
                      <SelectItem value="Istanbul Airport (IST)">Istanbul - IST (Airport)</SelectItem>
                      <SelectItem value="Istanbul Sabiha Gokcen Airport (SAW)">Istanbul - SAW (Sabiha Gokcen)</SelectItem>
                      <SelectItem value="New York John F. Kennedy Airport (JFK)">New York - JFK (John F. Kennedy)</SelectItem>
                      <SelectItem value="New York Newark Airport (EWR)">New York - EWR (Newark)</SelectItem>
                      <SelectItem value="Los Angeles International Airport (LAX)">Los Angeles - LAX (International)</SelectItem>
                      <SelectItem value="Chicago O'Hare International Airport (ORD)">Chicago - ORD (O'Hare International)</SelectItem>
                      <SelectItem value="Toronto Pearson International Airport (YYZ)">Toronto - YYZ (Pearson International)</SelectItem>
                      <SelectItem value="Bangkok Suvarnabhumi Airport (BKK)">Bangkok - BKK (Suvarnabhumi)</SelectItem>
                      <SelectItem value="Singapore Changi Airport (SIN)">Singapore - SIN (Changi)</SelectItem>
                      <SelectItem value="Kuala Lumpur International Airport (KUL)">Kuala Lumpur - KUL (International)</SelectItem>
                      <SelectItem value="Hong Kong International Airport (HKG)">Hong Kong - HKG (International)</SelectItem>
                      <SelectItem value="Beijing Capital International Airport (PEK)">Beijing - PEK (Capital International)</SelectItem>
                      <SelectItem value="Shanghai Pudong International Airport (PVG)">Shanghai - PVG (Pudong International)</SelectItem>
                      <SelectItem value="Tokyo Narita International Airport (NRT)">Tokyo - NRT (Narita International)</SelectItem>
                      <SelectItem value="Tokyo Haneda Airport (HND)">Tokyo - HND (Haneda)</SelectItem>
                      <SelectItem value="Seoul Incheon International Airport (ICN)">Seoul - ICN (Incheon International)</SelectItem>
                      <SelectItem value="Delhi Indira Gandhi International Airport (DEL)">Delhi - DEL (Indira Gandhi International)</SelectItem>
                      <SelectItem value="Mumbai Chhatrapati Shivaji International Airport (BOM)">Mumbai - BOM (Chhatrapati Shivaji International)</SelectItem>
                      <SelectItem value="Bangalore Kempegowda International Airport (BLR)">Bangalore - BLR (Kempegowda International)</SelectItem>
                      <SelectItem value="Chennai International Airport (MAA)">Chennai - MAA (International Airport)</SelectItem>
                      <SelectItem value="Hyderabad Rajiv Gandhi International Airport (HYD)">Hyderabad - HYD (Rajiv Gandhi International)</SelectItem>
                      <SelectItem value="Kolkata Netaji Subhas Chandra Bose International Airport (CCU)">Kolkata - CCU (Netaji Subhas Chandra Bose International)</SelectItem>
                      <SelectItem value="Sydney Kingsford Smith Airport (SYD)">Sydney - SYD (Kingsford Smith)</SelectItem>
                      <SelectItem value="Melbourne Airport (MEL)">Melbourne - MEL (Airport)</SelectItem>
                      <SelectItem value="Brisbane Airport (BNE)">Brisbane - BNE (Airport)</SelectItem>
                      <SelectItem value="Auckland Airport (AKL)">Auckland - AKL (Airport)</SelectItem>
                      <SelectItem value="Johannesburg OR Tambo International Airport (JNB)">Johannesburg - JNB (OR Tambo International)</SelectItem>
                      <SelectItem value="Cairo International Airport (CAI)">Cairo - CAI (International Airport)</SelectItem>
                      <SelectItem value="Casablanca Mohammed V International Airport (CMN)">Casablanca - CMN (Mohammed V International)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormField
              control={form.control}
              name={`flightSegments.${index}.departureDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`flightSegments.${index}.departureTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Time *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`flightSegments.${index}.arrivalDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`flightSegments.${index}.arrivalTime`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Time *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`flightSegments.${index}.flightNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flight Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="QR605" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`flightSegments.${index}.airline`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operated By *</FormLabel>
                  <FormControl>
                    <Input placeholder="Qatar Airways" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`flightSegments.${index}.seatClass`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Economy">Economy</SelectItem>
                      <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="First">First</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}