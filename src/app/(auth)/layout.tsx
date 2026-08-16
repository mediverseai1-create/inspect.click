import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper-dim">
      <div className="px-8 py-6 max-md:px-5">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center px-5 pb-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
