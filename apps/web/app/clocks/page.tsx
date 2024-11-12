"use client";
import { formatTime } from "@/services/date.service";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClocksPage() {
  const [now, setNow] = useState(new Date());
  const [format, setFormat] = useState<"12h" | "24h">("12h");

  useEffect(() => {
    const timeUpdater = setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => {
      clearInterval(timeUpdater);
    };
  }, []);

  return (
    <div className="container py-6">
      <div className="flex max-h-5">
        <h1>Clocks</h1>
        <span className="flex-1" />
        <button
          onClick={() =>
            format == "12h" ? setFormat("24h") : setFormat("12h")
          }
        >
          {format}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12 gap-4">
        <ClockCard label="UTC" time={formatTime(now, format, "UTC")} />
        <ClockCard label="Local" time={formatTime(now, format, "local")} />
      </div>
    </div>
  );
}


const ClockCard = ({ label, time }: { label: string; time: string }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex flex-col">
        <h4 className="flex gap-2 items-center">
          <Clock size={24} /> {label}
        </h4>
        <p className="mt-3">
          {/* {time.getHours()}:{time.getMinutes()} */}
          {time}
        </p>
        {/* <p>{time.getTimezoneOffset() / 60}h</p> */}
      </div>
    </div>
  );
};
