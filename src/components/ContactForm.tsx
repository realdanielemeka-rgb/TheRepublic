"use client";

import { useState, type FormEvent } from "react";
import Bracket from "./Bracket";

const budgetBands = ["<₦10m", "₦10–50m", "₦50m+", "Undisclosed"];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      if (json.fallback) {
        window.location.href = json.mailto;
        setStatus("sent");
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setError("We couldn't reach the server. Please email us directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-card)] border border-paper/20 p-8">
        <p className="display-type text-2xl">
          <Bracket>RECEIVED</Bracket>
        </p>
        <p className="measure mt-4 text-paper/80">
          We reply within two working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="mono-label">Name</span>
          <input
            required
            name="name"
            type="text"
            className="border-b border-paper/40 bg-transparent py-2 outline-none focus:border-republic"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="mono-label">Company</span>
          <input
            name="company"
            type="text"
            className="border-b border-paper/40 bg-transparent py-2 outline-none focus:border-republic"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="mono-label">Email</span>
          <input
            required
            name="email"
            type="email"
            className="border-b border-paper/40 bg-transparent py-2 outline-none focus:border-republic"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="mono-label">Budget band</span>
          <select
            name="budget"
            defaultValue={budgetBands[0]}
            className="border-b border-paper/40 bg-transparent py-2 outline-none focus:border-republic"
          >
            {budgetBands.map((band) => (
              <option key={band} value={band} className="text-ink">
                {band}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="mono-label">What are you trying to make happen?</span>
        <textarea
          required
          name="message"
          rows={5}
          className="border-b border-paper/40 bg-transparent py-2 outline-none focus:border-republic"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-paper underline decoration-republic decoration-2 underline-offset-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mono-label mt-2 w-fit rounded-full bg-republic px-8 py-4 text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send it →"}
      </button>
    </form>
  );
}
