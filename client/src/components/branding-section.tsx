import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Upload, X } from "lucide-react";

interface BrandingOptions {
  logoUrl?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

interface BrandingSectionProps {
  branding: BrandingOptions;
  onBrandingChange: (branding: BrandingOptions) => void;
}

export default function BrandingSection({ branding, onBrandingChange }: BrandingSectionProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        onBrandingChange({ ...branding, logoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    onBrandingChange({ ...branding, logoUrl: undefined });
  };

  const updateField = (field: keyof BrandingOptions, value: string) => {
    onBrandingChange({ ...branding, [field]: value || undefined });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-airline-blue" />
          Company Branding (Optional)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              {branding.logoUrl ? (
                <div className="relative">
                  <img 
                    src={branding.logoUrl} 
                    alt="Company Logo" 
                    className="h-16 w-auto border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: PNG or JPG, max 150x50px for best results
            </p>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <Input
              value={branding.companyName || ''}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="Your Travel Agency Name"
              className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
            />
          </div>

          {/* Company Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              value={branding.companyPhone || ''}
              onChange={(e) => updateField('companyPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
            />
          </div>

          {/* Company Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              value={branding.companyAddress || ''}
              onChange={(e) => updateField('companyAddress', e.target.value)}
              placeholder="123 Main St, City, Country"
              className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
            />
          </div>

          {/* Company Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              value={branding.companyEmail || ''}
              onChange={(e) => updateField('companyEmail', e.target.value)}
              placeholder="info@youragency.com"
              className="focus:ring-2 focus:ring-airline-blue focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Your branding will appear at the top of the e-ticket with logo on the left and company details on the right.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}