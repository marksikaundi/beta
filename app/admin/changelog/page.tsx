"use client";

import ChangelogAdmin from "@/components/admin/changelog-admin";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";

export default function ChangelogAdminPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">
              Please sign in to access the admin changelog management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TODO: Add proper admin role checking here
  // For now, allowing all authenticated users to access

  return <ChangelogAdmin />;
}
