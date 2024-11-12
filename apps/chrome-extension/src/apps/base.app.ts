export interface App {
    name: string;
    url: string;
    notes: Record<string, string>[];
    // hostnames: string[];
    // constructor(url: string): void;

    run(): Promise<void>;
    render(): React.ReactNode;
}
