import type { Metadata } from "next";
import { RecordOfRagnarok } from "@/features/ror/RorPage";

export const metadata: Metadata = {
    title: "Record of Ragnarok",
    description: "Choose Your God. Witness the Battle. Claim the Glory.",
};

export default function Page() {
    return <RecordOfRagnarok />;
}
