export type DocumentationNode = {
  id: string;
  title: string;
  slug: string;
  parentId?: string | null;
  icon?: string | null;
  children?: DocumentationNode[];
};

export const dummyDocumentationTree: DocumentationNode[] = [
  {
    id: "1",
    title: "Getting Started",
    slug: "getting-started",
    parentId: null,
    icon: "BookOpen", // <-- Added icon string
    children: [
      {
        id: "1-1",
        title: "Introduction",
        slug: "introduction",
        parentId: "1",
      },
      {
        id: "1-2",
        title: "Installation",
        slug: "installation",
        parentId: "1",
        children: [
          {
            id: "1-2-1",
            title: "Requirements",
            slug: "requirements",
            parentId: "1-2",
            children: [
              {
                id: "1-2-1-1",
                title: "Node.js",
                slug: "node-js",
                parentId: "1-2-1",
                children: [
                  {
                    id: "1-2-1-1-1",
                    title: "Version Setup",
                    slug: "version-setup",
                    parentId: "1-2-1-1",
                  },
                ],
              },
              {
                id: "1-2-1-2",
                title: "Package Managers",
                slug: "package-managers",
                parentId: "1-2-1",
              },
            ],
          },
          {
            id: "1-2-2",
            title: "Configuration",
            slug: "configuration",
            parentId: "1-2",
          },
        ],
      },
      {
        id: "1-3",
        title: "Quickstart",
        slug: "quickstart",
        parentId: "1",
      },
    ],
  },
  {
    id: "2",
    title: "Core Concepts",
    slug: "core-concepts",
    parentId: null,
    icon: "Code2", // <-- Added icon string
    children: [
      {
        id: "2-1",
        title: "Theming System",
        slug: "theming-system",
        parentId: "2",
        children: [
          {
            id: "2-1-1",
            title: "Tailwind Integration",
            slug: "tailwind-integration",
            parentId: "2-1",
          },
        ],
      },
      {
        id: "2-2",
        title: "API Reference",
        slug: "api-reference",
        parentId: "2",
      },
    ],
  },
];