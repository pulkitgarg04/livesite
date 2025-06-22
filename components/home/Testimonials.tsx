"use client";

import React from "react";
import { InfiniteMovingCards as InfiniteMovingCardsComponent } from "../ui/infinite-moving-cards";

export default function InfiniteMovingCards() {
  return (
    <div className="h-[30rem] rounded-md flex flex-col antialiased bg-black bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <h2 className="text-4xl font-semibold tracking-tighter text-center text-white mb-12">
          What Our Users Say
        </h2>
      <InfiniteMovingCardsComponent
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote: "LiveSite has been a transformative tool for me. I used to struggle with deploying static sites for client demos. Now, with just a few clicks, I can showcase my projects professionally and efficiently.",
    name: "Pulkit Garg",
    title: "Freelance Web Developer",
  },
  {
    quote: "As a designer, I don't like dealing with servers and configurations. LiveSite allows me to upload my HTML, CSS, and JS and see the magic happen instantly. It's exactly what I needed!",
    name: "Aditi Mehra",
    title: "UI/UX Designer",
  },
  {
    quote: "I'm a student, and LiveSite has been my go-to for hosting class projects. It's simple, fast, and gives me a professional-looking result that impresses my professors and peers.",
    name: "Rahul Sharma",
    title: "Computer Science Student",
  },
  {
    quote: "We use LiveSite to quickly test static prototypes for our startup. The deployment speed is unmatched, and the ability to manage multiple projects easily is a huge plus for our workflow.",
    name: "Ananya Kapoor",
    title: "Product Manager",
  },
  {
    quote: "LiveSite made my portfolio live in minutes. The clean interface and instant deployment make it perfect for developers at any level. Highly recommended!",
    name: "Karan Verma",
    title: "Junior Developer",
  },
];