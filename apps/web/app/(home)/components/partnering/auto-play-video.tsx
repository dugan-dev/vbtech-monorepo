type props = {
  src: string;
  width?: number;
  height?: number;
  className?: string;
};

export function AutoPlayVideo({ src, width, height, className }: props) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      width={width}
      height={height}
      className={className}
      aria-hidden="true" // Since it's decorative content
    />
  );
}
