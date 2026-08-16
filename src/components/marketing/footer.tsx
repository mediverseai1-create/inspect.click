import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-line pt-16 pb-8.5">
      <div className="max-w-[1180px] mx-auto px-8 max-md:px-5">
        <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] max-md:grid-cols-2 gap-10 pb-12">
          <div>
            <Logo />
            <p className="mt-3.5 text-sm text-ink-55 max-w-[230px]">
              AI inspection and corrective-action software for teams that inspect the same things, on a schedule.
            </p>
          </div>
          <div>
            <h5 className="mono text-[11.5px] text-ink-55 mb-4">PRODUCT</h5>
            <ul className="flex flex-col gap-2.75 list-none p-0">
              <li><a href="#product" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">Overview dashboard</a></li>
              <li><a href="#product" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">Inspection templates</a></li>
              <li><a href="#product" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">Findings & corrective actions</a></li>
              <li><a href="#product" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">AI Assistant</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mono text-[11.5px] text-ink-55 mb-4">COMPANY</h5>
            <ul className="flex flex-col gap-2.75 list-none p-0">
              <li><a href="#" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">About</a></li>
              <li><a href="#" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">Security</a></li>
              <li><a href="#" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">Contact sales</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mono text-[11.5px] text-ink-55 mb-4">LEGAL</h5>
            <ul className="flex flex-col gap-2.75 list-none p-0">
              <li><a href="#" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">Privacy policy</a></li>
              <li><a href="#" className="text-[14.5px] no-underline text-ink-70 hover:text-ink">Terms of service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line pt-6.5 flex justify-between flex-wrap gap-3 text-[13px] text-ink-55">
          <span>© {new Date().getFullYear()} InspectFlow. All rights reserved.</span>
          <span className="mono text-xs">MADE FOR TEAMS THAT INSPECT</span>
        </div>
      </div>
    </footer>
  );
}
