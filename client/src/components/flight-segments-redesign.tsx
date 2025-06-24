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
                  <FormControl>
                    <Input placeholder="Karachi Jinnah International Airport (KHI)" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="Doha Hamad International Airport (DOH)" {...field} />
                  </FormControl>
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