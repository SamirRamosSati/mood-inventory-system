"use client";

import { useEffect, useState } from "react";

export default function MobileBlocker({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || "";
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(
        mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-9999">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Not Supported</h1>
          <p className="text-gray-400 mb-6">
            This application is only available on desktop.
          </p>
          <p className="text-sm text-gray-500">
            Please open this on a computer or tablet with a larger screen.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
