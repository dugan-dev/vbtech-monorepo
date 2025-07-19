"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface UseQrCodeReturn {
  qrCodeDataUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useQrCode(data: string): UseQrCodeReturn {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      setIsLoading(false);
      setError("No data provided for QR code generation");
      return;
    }

    setIsLoading(true);
    setError(null);

    QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        setQrCodeDataUrl(dataUrl);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to generate QR code",
        );
        setIsLoading(false);
      });
  }, [data]);

  return { qrCodeDataUrl, isLoading, error };
}
