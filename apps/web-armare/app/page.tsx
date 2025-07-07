import Image from "next/image";
import { AlertCircle, Mail } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 shadow-sm">
        <div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Logo - Left aligned */}
          <div className="flex items-center space-x-2 sm:space-x-4 justify-self-start min-w-fit">
            <Image
              src="/acr.png"
              alt="Armare Health"
              width={400}
              height={120}
              className="h-16 w-auto rounded-md flex-shrink-0"
            />
          </div>

          {/* Title - Center aligned */}
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Provider Information
            </h1>
          </div>

          {/* Empty space for balance - Right aligned */}
          <div></div>
        </div>
      </header>
      {/* Alert Banner */}
      <div className="bg-blue-50 border-b border-blue-200 py-3">
        <div className="container mx-auto px-6">
          <Alert className="border-blue-200 bg-transparent">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Important Notice</AlertTitle>
            <AlertDescription className="text-blue-700">
              If you have received correspondence from Armare Claim Review
              regarding Medicare claim reviews, please review the information
              below for response procedures and requirements.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Overview Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About Our Organization
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Armare Claim Review is a Medicare payment integrity contractor
                  working on behalf of Medicare Advantage organizations to
                  review claims and identify potential overpayments in
                  accordance with CMS regulations.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  We conduct post-payment reviews of Medicare claims to ensure
                  accuracy and compliance with Medicare coverage guidelines and
                  payment policies.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="text-gray-600">
                    CMS Compliant
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    HIPAA Compliant
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Key Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organization Type:</span>
                    <span className="font-medium">
                      Payment Integrity Contractor
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primary Function:</span>
                    <span className="font-medium">Medicare Claim Review</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Regulatory Authority:</span>
                    <span className="font-medium">CMS Guidelines</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Review Type:</span>
                    <span className="font-medium">Post-Payment Audit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Requirements */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Response Requirements
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700">
                    Response Deadline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600 mb-2">
                    30 Days
                  </p>
                  <p className="text-sm text-gray-600">
                    From date of request letter
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-700">
                    Documentation Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Complete medical records</li>
                    <li>• Supporting documentation</li>
                    <li>• Itemized billing records</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">
                    Submission Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Secure email</li>
                    <li>• Secure fax</li>
                    <li>• Certified mail</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Alert className="mt-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Important</AlertTitle>
              <AlertDescription className="text-amber-700">
                Failure to respond within the specified timeframe may result in
                automatic recoupment of identified overpayments.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  General Inquiries
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">
                        providers@armareclaimreview.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Appeals & Disputes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Appeals Email</p>
                      <p className="text-gray-600">
                        appeals@armareclaimreview.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Records Submission */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Medical Records Submission
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mailing Address
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="font-medium text-gray-900">
                    Armare Claim Review
                  </p>
                  <p className="text-gray-700">Attn: Medical Records Review</p>
                  <p className="text-gray-700">P.O. Box 9419</p>
                  <p className="text-gray-700">San Diego, CA 92169</p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      Required on envelope:
                    </p>
                    <p className="text-sm text-gray-600">
                      Case Reference Number
                    </p>
                    <p className="text-sm text-gray-600">Provider NPI Number</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Electronic Submission
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-medium text-gray-900 mb-2">
                      Secure Email
                    </p>
                    <p className="text-gray-700">records@armaresupport.com</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Encrypted transmission required
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="font-medium text-gray-900 mb-2">Secure Fax</p>
                    <p className="text-gray-700">(858) 351-3291</p>
                    <p className="text-sm text-gray-500 mt-1">
                      HIPAA compliant transmission
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Submission Requirements
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Include case reference number on all submissions</li>
                <li>
                  • Provide complete medical records for dates of service in
                  question
                </li>
                <li>• Ensure all pages are legible and properly sequenced</li>
                <li>
                  • Include provider contact information for follow-up questions
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Appeals Process */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Appeals Process
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Initial Review Period
                  </h3>
                  <p className="text-gray-700">
                    30 days from receipt of determination letter to submit
                    additional documentation or request reconsideration.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Formal Appeal
                  </h3>
                  <p className="text-gray-700">
                    Submit written appeal with supporting documentation within
                    60 days of final determination.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Independent Review
                  </h3>
                  <p className="text-gray-700">
                    Cases undergo independent clinical review by qualified
                    healthcare professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Image
                src="/acr.png"
                alt="Armare Health"
                width={150}
                height={45}
                className="h-12 w-auto mb-4 rounded-md"
              />
              <p className="text-gray-600 text-sm">
                Medicare payment integrity contractor operating under CMS
                guidelines and regulations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Quick Access</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>General Inquiries: providers@armareclaimreview.com</li>
                <li>Appeals: appeals@armareclaimreview.com</li>
                <li>Medical Records: records@armareclaimreview.com</li>
                <li>Medical Records Fax: (858) 351-3291</li>
              </ul>
            </div>

            <div />
          </div>

          <Separator className="my-6" />

          <div className="text-center text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Armare Claim Review. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
