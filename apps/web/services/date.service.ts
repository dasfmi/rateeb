export const formatTime = (time: Date, format: "12h" | "24h", zone: string) => {
    const min = time.getMinutes();
    const minutes = min < 10 ? "0" + min : min;
  
    if (format === "12h") {
      const ampm = time.getHours() >= 12 ? "pm" : "am";
      let hours = time.getHours() % 12;
      hours = hours ? hours : 12;
  
      return `${hours}:${minutes} ${ampm}`;
    }
  
    if (zone === "UTC") {
      return time.toUTCString();
    }
  
    return `${time.getHours()}:${minutes}`;
  };