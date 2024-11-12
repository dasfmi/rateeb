
const items = [
    {
        title: "dasfmi.com",
        url: "https://dasfmi.com",
        favicon: "https://dasfmi.com/favicon.ico",
    },
    {
        title: "youtube",
        url: "https://youtube.com",
        favicon: "https://youtube.com/favicon.ico",
    },
    {
        title: "github",
        url: "https://github.com",
        favicon: "https://github.com/favicon.ico",
    },
    {
        title: "linkedin",
        url: "https://linkedin.com",
        favicon: "https://linkedin.com/favicon.ico",
    },
    {
        title: "twitter",
        url: "https://x.com",
        favicon: "https://x.com/favicon.ico",
    },
    {
        title: "facebook",
        url: "https://facebook.com",
        favicon: "https://facebook.com/favicon.ico",
    }
]

export default function QuickJump() {
  return  (<section id="QuickJump" className="rounded shadow px-4 py-2 flex gap-2 pt-24 items-center">
    <span className="text-muted text-xs">jump {'=>'}</span>
    {items && items.map((item, index) => (
        <a key={index} href={item.url} target="_blank">
            <img src={item.favicon} alt={item.title} className="rounded shadow-sm w-6"  />
        </a>
    ))}
  </section>);
}
