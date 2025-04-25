import type { Metadata } from "next";

import { ContactForm } from "./components/contact-form";
import { ContactInfo } from "./components/contact-info";

export const metadata: Metadata = {
  title: "Contact Us | Value Based Tech",
  description:
    "Get in touch with our team to simplify your healthcare operations.",
};

export default function ContactPage() {
  return (
    <main className="mt-20 flex flex-col flex-1">
      <section className="bg-[#1A3A5A] text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {`Let's Talk About Your Healthcare Operations`}
            </h1>
            <p className="mt-4 text-lg opacity-90">
              {`We're here to help you streamline workflows, reduce administrative
              burden, and improve ROI.`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F2F4F7]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
