import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Contact Information</h2>
      <p className="text-muted-foreground mb-6">
        {`Have questions about how we can help streamline your healthcare
        operations? We're ready to assist you with personalized solutions.`}
      </p>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Location</h3>
            <p className="text-muted-foreground">San Diego, California</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Phone</h3>
            <p className="text-muted-foreground">(888) 873-5837</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground">contact@valuebasedtech.com</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Availability</h3>
            <p className="text-muted-foreground">
              Monday - Friday: 7:00 AM PST - 5:00 PM PST
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium mb-4">Our Healthcare Expertise</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Enablers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Health Plans</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">ACOs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">IPAs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
