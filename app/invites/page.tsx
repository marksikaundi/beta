"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function InvitesPage() {
  const [email, setEmail] = useState("");
  const invites = useQuery(api.invites.list);
  const sendInvite = useMutation(api.invites.create);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendInvite({ email });
      setEmail("");
      toast.success("Invite sent successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invite");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Invites</h1>

      <Card className="p-6 mb-8">
        <form onSubmit={handleSendInvite} className="flex gap-4">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit">Send Invite</Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Sent Invites</h2>
        {invites?.length === 0 ? (
          <p className="text-muted-foreground">No invites sent yet</p>
        ) : (
          <div className="grid gap-4">
            {invites?.map((invite) => (
              <Card key={invite._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{invite.inviteeEmail}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {invite.status}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}