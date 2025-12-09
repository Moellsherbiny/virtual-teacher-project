"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivatePage() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("Activating...");

  useEffect(() => {
    if (!token) return setStatus("Invalid token");

    fetch("/api/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatus("Account activated ✅");
        else setStatus("Activation failed ❌");
      });
  }, [token]);

  return <div className="p-6">{status}</div>;
}
