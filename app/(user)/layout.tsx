import { Navbar } from "@/component/navbar";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-r">
          <Navbar />
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
