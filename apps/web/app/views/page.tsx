"use client";
import {
  Card,
  Flex,
  Grid,
  SegmentedControl,
  Text,
  Table,
  Link,
  Heading,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import useAppStore from "@/store/app.store";
import Tag from "@/ui/Tag";
import NewViewDialog from "@/components/NewViewDialog";

export default function ViewsIndex() {
  const { views, setViews, setIsLoading } = useAppStore();
  const [view, setView] = useState<"grid" | "list">("list");

  useEffect(() => {
    fetch("http://localhost:4000/api/views")
      .then((resp) => resp.json())
      .then((data) => {
        setViews(data.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [setIsLoading]);

  return (
    <>
      <Flex py="2" px="4" className="items-center" gap="2">
        <Heading size="1">Views</Heading>
        <Text color="gray">Organize your ideas into collections</Text>
        <span className="flex-1" />

        <NewViewDialog />

        <SegmentedControl.Root
          defaultValue={view}
          size={"1"}
          onValueChange={(v: "grid" | "list") => setView(v)}
        >
          <SegmentedControl.Item value="grid" aria-label="grid">
            Grid
          </SegmentedControl.Item>
          <SegmentedControl.Item value="list" aria-label="list">
            List
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </Flex>
      <div className="container flex flex-col">
        {views.length > 0 && view === "grid" && (
          <Grid
            gap="4"
            mt="4"
            columns={{ initial: "1", md: "2", lg: "3", xl: "4" }}
          >
            {views.map((v) => (
              <Card key={v.id}>
                <Link href={`/views/${v.id}`}>
                  <Heading size="4">{v.title}</Heading>
                  <Text size="2" color="gray">
                    {v.description}
                  </Text>
                </Link>
              </Card>
            ))}
          </Grid>
        )}

        {views.length > 0 && view === "list" && (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Cell>Title</Table.Cell>
                <Table.Cell>Description</Table.Cell>
                <Table.Cell>Target</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {views.map((v) => (
                <Table.Row key={v.id}>
                  <Table.RowHeaderCell>
                    <Link size={"3"} href={`/views/${v.id}`}>
                      {v.title}
                    </Link>
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {v.description}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {v.target.tags.map((t, i) => (
                      <Tag
                        key={i}
                        tag={t}
                        readOnly={true}
                        onDelete={function (): void {
                          throw new Error("Function not implemented.");
                        }}
                      />
                    ))}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}

        {views.length == 0 && <p>No Views found</p>}
      </div>
    </>
  );
}
