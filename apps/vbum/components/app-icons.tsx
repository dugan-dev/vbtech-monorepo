import Image from "next/image";

type LogoProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt" | "width" | "height"
> & {
  width?: number;
  height?: number;
};

export const AppIcons = {
  logo: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vb-um-blue.png"
      alt="VB UM Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
  logoDark: ({ width = 250, height = 100, ...props }: LogoProps) => (
    <Image
      src="/vb-um.png"
      alt="VB UM Logo"
      width={width}
      height={height}
      {...props}
    />
  ),
};
