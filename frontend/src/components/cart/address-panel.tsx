"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/vengeance/button";
import { Textarea } from "@/components/vengeance/textarea";
import { Spinner } from "@/components/vengeance/spinner";
import { siteConfig } from "@/lib/site-config";
import { useUpdateAddress } from "@/lib/hooks/use-me";

export function AddressPanel({ address }: { address: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(address);
  const update = useUpdateAddress();
  const isDefault = address.trim() === siteConfig.defaultAddress;

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    update.mutate(trimmed, { onSuccess: () => setEditing(false) });
  };

  if (editing) {
    return (
      <div className="space-y-3">
        <label htmlFor="checkout-address" className="text-sm font-medium">
          Delivery address
        </label>
        <Textarea id="checkout-address" rows={3} value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
        <div className="flex gap-2">
          <Button size="sm" onClick={save} aria-disabled={update.isPending || undefined}>
            {update.isPending ? <Spinner /> : null} Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setValue(address);
              setEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">Delivery address</p>
        <p className="text-muted-foreground">{address}</p>
        {isDefault ? (
          <p className="mt-1 text-sm text-highlight-text">
            This still looks like the placeholder address. Add your real address before ordering.
          </p>
        ) : null}
      </div>
      <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
        <Pencil className="size-3.5" aria-hidden /> Edit
      </Button>
    </div>
  );
}
