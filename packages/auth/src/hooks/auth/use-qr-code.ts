"use client";

import { useEffect, useReducer } from "react";
import QRCode from "qrcode";

interface UseQrCodeReturn {
  qrCodeDataUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

interface QrCodeState {
  qrCodeDataUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

type QrCodeAction =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: string }
  | { type: "ERROR"; payload: string }
  | { type: "NO_DATA" };

function qrCodeReducer(state: QrCodeState, action: QrCodeAction): QrCodeState {
  switch (action.type) {
    case "LOADING":
      return {
        qrCodeDataUrl: null,
        isLoading: true,
        error: null,
      };
    case "SUCCESS":
      return {
        qrCodeDataUrl: action.payload,
        isLoading: false,
        error: null,
      };
    case "ERROR":
      return {
        qrCodeDataUrl: null,
        isLoading: false,
        error: action.payload,
      };
    case "NO_DATA":
      return {
        qrCodeDataUrl: null,
        isLoading: false,
        error: "No data provided for QR code generation",
      };
    default:
      return state;
  }
}

export function useQrCode(data: string): UseQrCodeReturn {
  const [state, dispatch] = useReducer(qrCodeReducer, {
    qrCodeDataUrl: null,
    isLoading: Boolean(data),
    error: data ? null : "No data provided for QR code generation",
  });

  useEffect(() => {
    if (!data) {
      dispatch({ type: "NO_DATA" });
      return;
    }

    dispatch({ type: "LOADING" });

    let isMounted = true;

    QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        if (isMounted) {
          dispatch({ type: "SUCCESS", payload: dataUrl });
        }
      })
      .catch((err) => {
        if (isMounted) {
          dispatch({
            type: "ERROR",
            payload:
              err instanceof Error ? err.message : "Failed to generate QR code",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [data]);

  return state;
}
