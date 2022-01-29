export interface DocsifyHook {
  beforeEach(
    callback: (
      markdown: string,
      next: (markdown: string) => void
    ) => void | Promise<void>
  ): void;
}

export interface DocsifyVm {
  route: {
    path: string;
    file: string;
    query: Record<string, string>;
  };
}
