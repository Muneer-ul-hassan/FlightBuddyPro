import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Upload, X } from "lucide-react";

interface BrandingOptions {
  logoUrl?: string;
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

    const useDefaultLogo = () => {
        // You can replace this with your actual company logo URL
        const defaultLogoUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjM2NkYxIi8+Cjx0ZXh0IHg9IjUwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q09NUEFOWTwvdGV4dD4KPHN2Zz4K";
        onBrandingChange({ ...branding, logoUrl: defaultLogoUrl });
    };

  const updateField = (field: keyof BrandingOptions, value: string) => {
    onBrandingChange({ ...branding, [field]: value || undefined });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-purple-600" />
          Company Logo Upload
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Your Company Logo
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={useDefaultLogo}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Use Company Logo
                  </button>
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
                    Upload Logo
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: PNG or JPG, max 150x50px for best results
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}