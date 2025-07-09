import Image from "next/image";
import { FOOTER_LINKS } from "@/values/footer";

import { Separator } from "@workspace/ui/components/separator";

export function Footer() {
  return (
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
              sizes="150px"
            />
            <p className="text-gray-600 text-sm">
              Medicare payment integrity contractor operating under CMS
              guidelines and regulations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Quick Access</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {FOOTER_LINKS.quickAccess.map((link) => (
                <li key={link.label}>
                  {link.label}: {link.value}
                </li>
              ))}
            </ul>
          </div>

          <div aria-hidden="true" />
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
  );
}
