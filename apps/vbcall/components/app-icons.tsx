import Image from "next/image";

type LogoProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt"> & {
  width?: number;
  height?: number;
};

export const AppIcons = {
  logo: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vbcall-logo-blue.png"
      alt="VB Call Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
  logoDark: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vbcall-logo.png"
      alt="VB Call Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
};
