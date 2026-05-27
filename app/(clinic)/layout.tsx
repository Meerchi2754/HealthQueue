import { ClinicNavbar } from "@/component/clinic/ClinicNavbar";
export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="bg-white border-r">
        <ClinicNavbar />
      </div>
      <div>{children}</div>
    </div>
  );
}
    