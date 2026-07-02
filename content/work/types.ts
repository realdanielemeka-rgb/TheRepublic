export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  services: string[];
  year: number;
  brief: string;
  idea: string;
  results: { value: string; label: string }[]; // empty allowed
  media: { src?: string; alt: string }[]; // src pending real asset delivery
  featured: boolean;
  status: "live" | "pending-approval"; // pending never renders publicly
};
