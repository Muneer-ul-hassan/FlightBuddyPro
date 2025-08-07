import { UseFormReturn } from "react-hook-form";
import { FlightBookingForm } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plane } from "lucide-react";

interface FlightSegmentsSectionProps {
  form: UseFormReturn<FlightBookingForm>;
}

export default function FlightSegmentsSection({ form }: FlightSegmentsSectionProps) {
  const segmentCount = form.watch("flightSegmentCount");

  const updateSegmentCount = (count: number) => {
    form.setValue("flightSegmentCount", count);
    
    // Update the flight segments array
    const currentSegments = form.getValues("flightSegments");
    const newSegments = Array.from({ length: count }, (_, index) => {
      return currentSegments[index] || {
        flightNumber: "",
        airline: "",
        from: "",
        to: "",
        date: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
      };
    });
    form.setValue("flightSegments", newSegments);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Plane className="w-5 h-5 mr-2 text-airline-blue" />
          Flight Information
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How many flight segments? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <label key={num} className="relative cursor-pointer">
                <input
                  type="radio"
                  value={num}
                  checked={segmentCount === num}
                  onChange={() => updateSegmentCount(num)}
                  className="sr-only peer"
                />
                <div className="w-full p-3 text-center border-2 border-gray-300 rounded-lg peer-checked:border-airline-blue peer-checked:bg-airline-light peer-checked:text-airline-dark transition-all">
                  {num}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Flight Segment Details */}
        <div className="space-y-4">
          {Array.from({ length: segmentCount }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-airline-blue text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                Flight Segment {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`flightSegments.${index}.flightNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Flight Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., QR605"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
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
                      <FormLabel>
                        Operated By (Airline) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Qatar Airways"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`flightSegments.${index}.from`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        From <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., DOH"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`flightSegments.${index}.to`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        To <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., JFK"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`flightSegments.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Departure Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
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
                      <FormLabel>
                        Arrival Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
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
                      <FormLabel>
                        Departure Time <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
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
                      <FormLabel>
                        Arrival Time <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
