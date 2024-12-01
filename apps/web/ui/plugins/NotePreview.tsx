import { OutputBlockData } from "@editorjs/editorjs";
import BlockCard from "../../components/blocks/BlockCard";
import icon from "./icon.svg";

export class NotePreview {
  static toolbox() {
    return {
      title: "Note Preview",
      icon: icon,
      component: BlockCard,
    };
  }
  private data: OutputBlockData;

  constructor({ data }: {data: OutputBlockData}) {
    this.data = data;
  }

  render() {
    console.log({data: this.data})
    return (
      <BlockCard
        block={{
          id: undefined,
          title: "",
          type: "note",
          tags: [],
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
