import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { flightBookingSchema, type FlightBookingForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import PersonalInfoSection from "./personal-info-section";
import FlightSegmentsSection from "./flight-segments-section";
import PassengersSection from "./passengers-section";
import { generatePDF } from "@/lib/pdf-utils";

export default function FlightBookingForm() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const form = useForm<FlightBookingForm>({
    resolver: zodResolver(flightBookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      flightSegmentCount: 1,
      flightSegments: [
        {
          flightNumber: "",
          airline: "",
          from: "",
          to: "",
          date: "",
          departureTime: "",
          arrivalTime: "",
        },
      ],
      passengerCount: 1,
      passengers: [
        {
          name: "",
          eTicketNumber: "",
          baggage: [],
        },
      ],
      paymentMethod: undefined,
      consentGiven: false,
    },
  });

  const submitBookingMutation = useMutation({
    mutationFn: async (data: FlightBookingForm) => {
      const response = await apiRequest("POST", "/api/bookings", {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        flightSegments: data.flightSegments,
        passengers: data.passengers,
        paymentMethod: data.paymentMethod,
        consentGiven: data.consentGiven,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Submitted Successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FlightBookingForm) => {
    submitBookingMutation.mutate(data);
  };

  const handleGeneratePDF = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Please fix errors",
        description: "Please complete all required fields before generating PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const formData = form.getValues();
      await generatePDF(formData);
      toast({
        title: "PDF Generated Successfully!",
        description: "Your booking confirmation has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PersonalInfoSection form={form} />
        <FlightSegmentsSection form={form} />
        <PassengersSection form={form} />

        {/* Consent Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-airline-blue" />
              Terms & Conditions
            </h2>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...form.register("consentGiven")}
                className="mt-1 w-4 h-4 text-airline-blue border-gray-300 rounded focus:ring-airline-blue focus:ring-2"
              />
              <label className="text-sm text-gray-700 leading-relaxed">
                I agree to the booking terms and conditions{" "}
                <span className="text-red-500">*</span>
                <br />
                <span className="text-gray-500 text-xs">
                  By checking this box, you confirm that you have read and agree to our booking terms,
                  privacy policy, and cancellation conditions.
                </span>
              </label>
            </div>
            {form.formState.errors.consentGiven && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.consentGiven.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-airline-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              Payment Method (Optional)
            </h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Method
              </label>
              <select
                {...form.register("paymentMethod")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-colors"
              >
                <option value="">Choose payment method</option>
                <option value="stripe">Credit/Debit Card (Stripe)</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Generate E-Ticket Section */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Button
                type="button"
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="w-full sm:w-auto px-8 py-4 bg-airline-blue text-white hover:bg-airline-dark text-lg font-semibold"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                ) : (
                  <Download className="w-6 h-6 mr-3" />
                )}
                {isGeneratingPDF ? "Generating E-Ticket..." : "Generate Professional E-Ticket"}
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Creates a professional airline-style e-ticket PDF for your client
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
