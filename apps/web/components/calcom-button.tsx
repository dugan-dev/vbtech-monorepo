"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

import { Button } from "@workspace/ui/components/button";

export function CalcomButton() {
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi({ namespace: "vb-pay-demo" });
        cal("ui", {
          styles: { branding: { brandColor: "#252C37" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch (error) {
        console.error("Failed to initialize Cal.com API:", error);
        // Consider showing a fallback UI or notifying the user
      }
    })();
  }, []);
  return (
    <Button
      data-cal-namespace="vb-pay-demo"
      data-cal-link="tdugan-vbtech/vb-pay-demo"
      data-cal-config='{"layout":"month_view"}'
      size={"lg"}
    >
      Schedule Demo
    </Button>
  );
}
