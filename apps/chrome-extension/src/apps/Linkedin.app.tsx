export const hostnames = ["linkedin.com"];

export class LinkedinApp {
  name = "Linkedin";
  notes: Record<string, string>[] = [];

  constructor(public url: string) {}

  async run() {
    const resp = await fetch(
      `https://rateeb.dasfmi.com/api/notes?linkedin=${encodeURIComponent(
        this.url
      )}`
    );
    const data = await resp.json();
    this.notes = data.data;
  }

  render() {
    if (!this.notes) {
      return <div>...</div>;
    }
    return (
      <div className="">
        <hr />
        {this.notes.map((note) => (
          <div key={note._id} className={"flex flex-col gap-1 w-full"}>
            <p className="text-muted text-xs">{note.createdAt}</p>
            <p>{note.title}</p>
          </div>
        ))}
      </div>
    );
  }
}
