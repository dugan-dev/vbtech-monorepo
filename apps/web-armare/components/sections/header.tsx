import Image from "next/image";

export function Header() {
  return (
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
            priority
            sizes="(max-width: 768px) 200px, 400px"
          />
        </div>

        {/* Title - Center aligned */}
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Provider Information
          </h1>
        </div>

        {/* Empty space for balance - Right aligned */}
        <div aria-hidden="true" />
      </div>
    </header>
  );
}
