import { OutputBlockData } from "@editorjs/editorjs";
import NoteCard from "../NoteCard";
import icon from "./icon.svg";

export class NotePreview {
  static toolbox() {
    return {
      title: "Note Preview",
      icon: icon,
      component: NoteCard,
    };
  }
  private data: OutputBlockData;

  constructor({ data }: {data: OutputBlockData}) {
    this.data = data;
  }

  render() {
    console.log({data: this.data})
    return (
      <NoteCard
        note={{
          _id: undefined,
          title: "",
          type: "note",
          tags: [],
          text: undefined,
          description: undefined,
          image: undefined,
          createdAt: undefined,
          url: undefined,
          hostname: undefined,
          name: undefined,
          email: undefined,
          site: undefined,
          github: undefined,
          linkedin: undefined,
          isPinned: undefined,
          target: undefined,
        }}
        onAction={function (action: string): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  save(blockContent: any) {
    return {
      target: { id: blockContent._id },
    };
  }
}
