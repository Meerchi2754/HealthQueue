import { SubHeroProps } from "@/types";

export default function subHeroSection({ title, subheading }: SubHeroProps) {
  return (
    <div className="bg-linear-to-r from-blue-900 to-blue-600 text-center text-white p-15">
      <h1 className="font-extrabold text-4xl">{title}</h1>
      <p className="m-3">{subheading}</p>
    </div>
  );
}
