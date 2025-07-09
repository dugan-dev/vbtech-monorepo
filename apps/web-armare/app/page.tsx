import { AlertBanner } from "@/components/sections/alert-banner";
import { AppealsProcess } from "@/components/sections/appeals-process";
import { ContactInfo } from "@/components/sections/contact-info";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { MedicalRecords } from "@/components/sections/medical-records";
import { Overview } from "@/components/sections/overview";
import { ResponseRequirements } from "@/components/sections/response-requirements";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AlertBanner />
      <main className="container mx-auto px-6 py-8">
        <Overview />
        <ResponseRequirements />
        <ContactInfo />
        <MedicalRecords />
        <AppealsProcess />
      </main>
      <Footer />
    </div>
  );
}
