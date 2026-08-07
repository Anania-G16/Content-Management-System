export type DocumentationNode = {
  id: string;
  title: string;
  slug: string;
  children?: DocumentationNode[];
};

export const dummyDocumentationTree: DocumentationNode[] = [
  {
    id: "1",
    title: "Getting Started",
    slug: "getting-started",
    children: [
      {
        id: "1-1",
        title: "Introduction",
        slug: "introduction",
      },
      {
        id: "1-2",
        title: "Installation",
        slug: "installation",
        children: [
          {
            id: "1-2-1",
            title: "Requirements",
            slug: "requirements",
            children: [
              {
                id: "1-2-1-1",
                title: "Node.js",
                slug: "node-js",
                children: [
                  {
                    id: "1-2-1-1-1",
                    title: "Version Setup",
                    slug: "version-setup",
                  },
                ],
              },
              {
                id: "1-2-1-2",
                title: "Package Managers",
                slug: "package-managers",
              },
            ],
          },
          {
            id: "1-2-2",
            title: "Configuration",
            slug: "configuration",
          },
        ],
      },
      {
        id: "1-3",
        title: "Quickstart",
        slug: "quickstart",
      },
    ],
  },
  {
    id: "2",
    title: "Core Concepts",
    slug: "core-concepts",
    children: [
      {
        id: "2-1",
        title: "Theming System",
        slug: "theming-system",
        children: [
          {
            id: "2-1-1",
            title: "Tailwind Integration",
            slug: "tailwind-integration",
          },
        ],
      },
      {
        id: "2-2",
        title: "API Reference",
        slug: "api-reference",
      },
    ],
  },
];