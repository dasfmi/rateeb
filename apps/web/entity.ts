export type ChartBlockViewer = {
  id: string;
  title: string;
  description?: string;
  type: 'chart',
  properties: {
    databaseId: string;
    chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'polar';
    query: {key: string, value: string};
  }
  createdAt: number;
  updatedAt: number;
}

export type Block = {
  id?: string;
  title: string;
  description?: string;
  type:
    | "url"
    // | "email"
    | "contact"
    | "document"
    | "database"
    | "chart"
    // | "media+image"
    // | "media+video"
    | "note"
    | "location"
    | "canvas"
    | "reminder"
    | "other";
  tags: string[];
  createdAt?: number;
  updatedAt?: number;
  // properties: Properties<T>;
  properties: DatabaseProperties & BookmarkProperties & ContactProperties & DocumentProperties & TextProperties & ReminderProperties & CanvasProperties;
  blocks?: any; // heavy content like documents or canvas children
  // other flags
  isPinned?: boolean;
  // meta layer
  target?: string;

  version?: string;
};

// type Properties<T> = T

export type DocumentProperties = {
  blocks: any[]
}
export type CanvasProperties = {
  blocks: any[]
}

export type TextProperties = {
  text: string;
}

export type DatabaseProperties = {
  columns: {label: string, type: string, format?: string}[],
  footer: {
    columns: {type: string, operation: string}[],
  }
}

export type ReminderProperties = TextProperties & { date: number; }

export type BookmarkProperties = {
  url: string;
  contentType?: string;
  hostname?: string;
  thumbnail?: string;
  platform?: string;
}

export type ContactProperties = {
  emails?: Record<string, string>;
  sites?: Record<string, string>;
  github?: string;
  linkedin?: string;
  x?: string; // twitter
  phones?: Record<string, string>;
  addresses?: Record<string, string>;
}

// export type MediaProperties = {}

export type View = {
  id?: string;
  title: string;
  type: "kanban" | "list"
  description?: string;
  blocks?: Block[]; // list of ids
  properties?: {
    columns?: Record<string, ViewColumn>
  },
  target: {
    tags: string[]
  }
  createdAt: number;
  isDeleted?: boolean;
};


export type ViewColumn = {
  title: string;
  tag: string
  color: string
}
