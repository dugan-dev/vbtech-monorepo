import Image from "next/image";
import { Briefcase, DollarSign, MapPin, Monitor, Video } from "lucide-react";

export const metadata = {
  title: "VB Tech at HLTH 2024",
  description:
    "We're excited to showcase VB Pay at Kiosk 41 in the Digital Health Hub at HLTH USA 2024 in Las Vegas from October 20–23.",
  openGraph: {
    title: "VB Tech at HLTH 2024",
    description:
      "We're excited to showcase VB Pay at Kiosk 41 in the Digital Health Hub at HLTH USA 2024 in Las Vegas from October 20–23.",
  },
  twitter: {
    title: "VB Tech at HLTH 2024",
    description:
      "We're excited to showcase VB Pay at Kiosk 41 in the Digital Health Hub at HLTH USA 2024 in Las Vegas from October 20–23.",
  },
  keywords: [
    "VB Tech",
    "HLTH 2024",
    "VB Pay",
    "value-based payment",
    "healthcare",
    "HLTH",
    "HLTH USA",
  ],
};

export default function Page() {
  return (
    <div className="mt-20 flex flex-col items-center flex-1">
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-[#252c37] text-white rounded-md">
          <div className="container mx-auto flex flex-col items-center justify-between px-4 py-10 md:flex-row">
            <div className="mb-10 md:mb-0 md:w-1/2">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                Join VB Tech at HLTH 2024!
              </h1>
              <p className="mb-2 text-xl">
                {
                  "We're excited to showcase VB Pay at Kiosk 41 in the Digital Health Hub at HLTH USA 2024 in Las Vegas from October 20–23.Stop by to learn how we're simplifying value-based payment administration for ACOs, MSOs, and other risk-bearing entities."
                }
              </p>
            </div>
            <div className="md:w-1/3">
              <Image
                src="/HLTH-2024-HealthHub-VBTech.png"
                alt="HLTH 2024 Conference"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-3xl font-bold text-[#252c37]">
              {"What You'll Find at Our Kiosk"}
            </h2>
            <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center">
                <MapPin className="mr-2 text-[#252c37]" />
                <span>
                  Kiosk 41, Digital Health Hub, HLTH USA 2024, Las Vegas
                </span>
              </div>
              <div className="flex items-center">
                <Monitor className="mr-2 text-[#252c37]" />
                <span>Interactive product demos of VB Pay</span>
              </div>
              <div className="flex items-center">
                <Video className="mr-2 text-[#252c37]" />
                <span>
                  Videos highlighting alternate payment models and operational
                  efficiency
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 text-[#252c37]" />
                <span>
                  Customer benefits insights, including reduced costs and faster
                  payments
                </span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-2 text-[#252c37]" />
                <span>
                  Overview of our white-glove BPaaS solution, designed to
                  streamline value-based payment administration
                </span>
              </div>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdF0EhzDHgo5BLzAqEJ6Y5QQTLJNbrKvQqLOarFj1f2eOtdAg/viewform?embedded=true"
            width="100%"
            height="1070"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
}
