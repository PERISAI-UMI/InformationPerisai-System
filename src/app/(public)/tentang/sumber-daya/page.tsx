import type { Metadata } from "next";
import { SumberDayaView } from "./SumberDayaView";

export const metadata: Metadata = {
  title: "Sumber Daya & Fungsionaris — UKM PERISAI UMI",
  description:
    "Formasi hierarki kepengurusan, dewan pembina, pengurus harian, kepala departemen, staf ahli, dan 6 departemen pergerakan riset UKM PERISAI Universitas Muslim Indonesia.",
};

export default function SumberDayaPage() {
  return <SumberDayaView />;
}
