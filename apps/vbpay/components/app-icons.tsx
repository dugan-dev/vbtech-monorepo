import Image from "next/image";

type LogoProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt"> & {
  width?: number;
  height?: number;
};

export const AppIcons = {
  logo: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vbpay-logo-blue.png"
      alt="VB Pay Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
  logoDark: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vbpay-logo.png"
      alt="VB Pay Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
  nppesLogo: ({ width = 120, height = 120, ...props }: LogoProps) => (
    <Image
      src="/NPPES-logo.png"
      alt="NPPES Logo"
      width={width}
      height={height}
      {...props}
      loading="lazy"
    />
  ),
};
