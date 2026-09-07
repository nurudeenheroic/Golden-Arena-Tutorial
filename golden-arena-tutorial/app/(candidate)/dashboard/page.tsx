// app/(candidate)/dashboard/page.js
import { SideRail } from "@/components/shared/SideRail";

export default function DashboardPage() {
  return (
    <div>
      <SideRail user={userFromDb} isLoading={isLoadingUser} />
    </div>
  );
}