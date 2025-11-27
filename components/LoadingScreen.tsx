import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin-fast inline-block">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={220}
            height={220}
          />
        </div>
      </div>
    </div>
  );
}
