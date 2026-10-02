import { AdminGuard } from "@/components/layout/guards";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <h1 className="font-serif text-2xl font-medium">Admin</h1>
        <AdminNav />
        {children}
      </div>
    </AdminGuard>
  );
}
