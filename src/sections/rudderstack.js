"use client";

import { useEffect } from "react";
import { rudderInitialize } from "../../rudderInitialize";

export default function RudderStackInitializer() {
  useEffect(() => {
    rudderInitialize();
  }, []);

  return <></>;
}
