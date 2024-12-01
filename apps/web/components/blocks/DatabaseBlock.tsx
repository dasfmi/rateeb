"use client";
import { Block } from "@/entity";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  TextField,
  Checkbox,
  IconButton,
  ContextMenu,
  Section,
  Container,
} from "@radix-ui/themes";
import { ReactNode, useState } from "react";

export default function DatabaseBlock({
  block: initialBlock,
  onSave,
}: {
  block: Block;
  onSave: (block: Block) => void;
}) {
  const [block, setBlock] = useState<Block>(initialBlock);
  const [columns, setColumns] = useState(block.properties.columns);

  const sumCols = (i: number) => {
    let total = 0;
    for (const row of block.blocks) {
      if (row[i] !== "") {
        total += row[i];
      }
    }
    return total;
  };

  const countCols = (i: number) => {
    return block.blocks.length;
  };

  const updateCell = (rowIndex: number, cellIndex: number, value: any) => {
    const col = block.properties.columns[cellIndex];
    if (["number", "currency"].includes(col.type)) {
      console.log(col.type);
      if (value === "") {
        block.blocks[rowIndex][cellIndex] = 0;
      } else {
        block.blocks[rowIndex][cellIndex] = parseFloat(value);
      }
    } else {
      block.blocks[rowIndex][cellIndex] = value;
    }
    setBlock({ ...block });
    onSave(block);
  };

  const addNewRow = (index?: number) => {
    const row = new Array(columns.length).fill("");
    if (index) {
      block.blocks.splice(index, 0, row);
    } else {
      block.blocks.push(row);
    }
    setBlock({ ...block });
    onSave(block);
  };

  const addNewColumn = () => {
    const newColumn = {
      label: "New column",
      type: "text",
    };
    // block.properties.columns.push(newColumn);
    console.log({ block });
    setColumns([...columns, newColumn]);
    block.blocks.forEach((row) => {
      // TODO: check column type and determine if new value should be empty string or zero
      row.push("");
    });
    setBlock({
      ...block,
      properties: { ...block.properties, columns: columns },
    });
    onSave(block);
  };

  const onHeaderAction = (index: number, action: ContextAction) => {
    switch (action.action) {
      case "updateProperty":
        columns[index].label = action.value;
        setColumns([...columns]);
        setBlock({
          ...block,
          properties: { ...block.properties, columns: columns },
        });
        onSave(block);
        break;
      case "deleteProperty":
        columns.splice(index, 1);
        // remove the values from the rows
        block.blocks.forEach((row) => {
          row.splice(index, 1);
        });
        setColumns([...columns]);
        setBlock({
          ...block,
          properties: { ...block.properties, columns: columns },
        });
        onSave(block);
        break;
    }
  };

  const deleteRow = (index: number) => {
    block.blocks.splice(index, 1);
    setBlock({ ...block });
    onSave(block);
  };

  return (
    <Flex direction="column">
      <Flex direction={"row"}>
        <div className="w-20 min-w-20" />
        <div>
        <Heading>{block.title}</Heading>
        <Text size="2" color="gray">
          {block.description}
        </Text>
        </div>
      </Flex>

      <Box my="4">
        {/* header  */}
        <Flex direction="row" gap="0" className="" width={"full"}>
          <div className="flex items-center flex-row-reverse p-2 w-20">
            <Checkbox size="1" />
          </div>
          {columns.map((col, index) => (
            <HeaderContextMenu
              title={col.label}
              key={index}
              onAction={(action: ContextAction) =>
                onHeaderAction(index, action)
              }
            >
              <Box
                p="2"
                className="w-48 border-l first:border-l-0 border-b border-gray-4"
              >
                {col.label}
              </Box>
            </HeaderContextMenu>
          ))}
          {/* empty column at the end */}
          <Box p="2" className="flex-1 border-l border-b border-gray-4">
            <IconButton variant="ghost" onClick={() => addNewColumn()}>
              <PlusIcon />
            </IconButton>
          </Box>
        </Flex>

        {/* rows  */}
        {block.blocks.map((row: any[], rowIndex: number) => (
          <DatabaseRow
            key={rowIndex}
            index={rowIndex}
            row={row}
            addNewRow={addNewRow}
            deleteRow={deleteRow}
            updateCell={updateCell}
          />
        ))}

        {/* pre-footer  */}
        <Flex>
          <Box className="w-20"></Box>
          <button
            className="flex-1 p-2 m-0 w-full text-left inline-flex gap-2 items-center hover:bg-gray-3"
            onClick={() => addNewRow()}
          >
            <PlusIcon />{" "}
            <Text color="gray" size="2">
              New row
            </Text>
          </button>
        </Flex>
        {/* footer  */}
        <Flex>
          <Box p="2" className="w-20 min-w-20"></Box>
          {block.properties.footer.columns.map((col, i) => (
            <Box key={i} p="2" className="w-48">
              {col &&
                col.type === "aggregation" &&
                col.operation === "sum" &&
                sumCols(i)}
              {col &&
                col.type === "aggregation" &&
                col.operation === "count" &&
                countCols(i)}
            </Box>
          ))}
          <Box p="2"></Box>
        </Flex>
      </Box>
    </Flex>
  );
}

type DatabaseRowProps = {
  index: number;
  row: any;
  addNewRow: (index: number) => void;
  deleteRow: (index: number) => void;
  updateCell: (index: number, cellIndex: number, value: any) => void;
};

const DatabaseRow = ({
  index,
  row,
  addNewRow,
  deleteRow,
  updateCell,
}: DatabaseRowProps) => {
  const [showControls, setShowControls] = useState(false);
  return (
    <Flex
      className="hover:bg-gray-2"
      key={index}
      p="0"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        className={`p-2 min-w-20 w-20 ${showControls ? "visible" : "invisible"}`}
      >
        <Flex gap="2" className="items-center" justify="center">
          <IconButton variant="ghost" onClick={() => addNewRow(index + 1)}>
            <PlusIcon />
          </IconButton>
          <IconButton
            onClick={() => deleteRow(index)}
            size="1"
            color="red"
            variant="ghost"
          >
            <TrashIcon />
          </IconButton>
          <Checkbox size="1" />
        </Flex>
      </div>
      {row.map((cell: any, cellIndex: number) => (
        <Box
          key={`${index}-${cellIndex}`}
          className="border-b border-gray-4 border-l first:border-l-0 w-48 min-w-48"
        >
          <input
            className="border-none px-2 py-1 focus:outline-none bg-transparent"
            defaultValue={cell}
            onChange={(e) => updateCell(index, cellIndex, e.target.value)}
          />
        </Box>
      ))}
      {/* empty column at the end */}
      <Box p="2" className="border-l border-b border-gray-4 w-full"></Box>
    </Flex>
  );
};

const HeaderContextMenu = ({
  title,
  children,
  onAction,
}: {
  onAction: (action: ContextAction) => void;
  title: string;
  children: ReactNode;
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <TextField.Root
          placeholder="property name"
          defaultValue={title}
          onChange={(e) =>
            onAction({ action: "updateProperty", value: e.target.value })
          }
        />
        <ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />

        <ContextMenu.Sub>
          <ContextMenu.Item>Sort ascending</ContextMenu.Item>
          <ContextMenu.Item>Sort descending</ContextMenu.Item>
          <ContextMenu.Item>Filter</ContextMenu.Item>
        </ContextMenu.Sub>

        <ContextMenu.Separator />

        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Move to project…</ContextMenu.Item>
            <ContextMenu.Item>Move to folder…</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Advanced options…</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>

        <ContextMenu.Separator />
        <ContextMenu.Item>Share</ContextMenu.Item>
        <ContextMenu.Item>Add to favorites</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item
          shortcut="⌘ ⌫"
          color="red"
          onClick={() => onAction({ action: "deleteProperty" })}
        >
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

type ContextAction = {
  action: "updateProperty" | "deleteProperty";
  value?: any;
};
