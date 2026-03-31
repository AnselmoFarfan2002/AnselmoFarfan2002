"use client";

import sleep from "@/app/(root)/_utils/sleep";
import { useEffect, useRef, useState } from "react";

interface Item {
  id: number;
  name: string;
}

function generateRandomItem(amount: number = 1): Item[] {
  return Array.from({ length: amount }, (_, i) => ({
    id: Math.round(Math.random() * 100),
    name: "Random Item",
  }));
}

const INIT_ITEMS = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: "Fixed Item",
}));

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>(INIT_ITEMS);
  const lastItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lastItemRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (!entry.isIntersecting || isLoading) return;

          setIsLoading(true);
          await sleep(1000);
          setIsLoading(false);
          setItems((items) => items.concat(generateRandomItem(35)));
        });
      },
      { threshold: 1 },
    );

    observer.observe(lastItemRef.current);
    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      <h2 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight gradient md:text-3xl gradient">
        Infinity Scroll
      </h2>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {items.map((item, i) => {
          const isLastItem = i === items.length - 15;
          return (
            <div
              key={item.id + "_" + i}
              className="p-4 border border-white/10 bg-white/5 min-w-40 flex-1 text-center rounded-2xl space-y-3"
              ref={isLastItem ? lastItemRef : undefined}
            >
              <div className="text-5xl">
                {item.id.toString().padStart(2, "0")}
              </div>
              <div>{item.name}</div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="w-full pt-4">
          <div className="rounded-full border-t-transparent border-b-transparent border-4 h-12 w-12 animate-spin mx-auto"></div>
        </div>
      )}
    </>
  );
}
