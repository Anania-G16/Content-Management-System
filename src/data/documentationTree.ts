export type DocumentationNode = {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  icon?: string | null;
  content?: object;
  children?: DocumentationNode[];

   status?: "DRAFT" | "PUBLISHED";
  updatedAt?: string;
};

export const dummyDocumentationTree: DocumentationNode[] = [
  {
    id: "doc-1",
    title: "Getting Started",
    slug: "getting-started",
    parentId: null,
    icon: "Rocket",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Getting Started" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Welcome to the documentation. This guide will help you get started with the platform.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "What You Will Learn" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "How to install the platform" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "How to configure your environment" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "How to create your first document" }],
                },
              ],
            },
          ],
        },
      ],
    },
    children: [
      {
        id: "doc-1-1",
        title: "Introduction",
        slug: "introduction",
        parentId: "doc-1",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Introduction" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This section provides an overview of the documentation platform and its main features.",
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The platform allows administrators to create, organize, and manage documentation using a nested structure.",
                },
              ],
            },
          ],
        },
      },
      {
        id: "doc-1-2",
        title: "Installation",
        slug: "installation",
        parentId: "doc-1",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Installation" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Follow these steps to install and prepare the platform for use.",
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Before You Begin" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Make sure your system satisfies the requirements described in the Requirements section.",
                },
              ],
            },
            {
              type: "orderedList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Install Node.js" }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Clone the project repository" }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Install project dependencies" }],
                    },
                  ],
                },
              ],
            },
            {
              type: "codeBlock",
              attrs: { language: "bash" },
              content: [
                {
                  type: "text",
                  text: "npm install",
                },
              ],
            },
          ],
        },
        children: [
          {
            id: "doc-1-2-1",
            title: "Requirements",
            slug: "requirements",
            parentId: "doc-1-2",
            content: {
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: "System Requirements" }],
                },
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Before installing the platform, ensure that your development environment meets the following requirements.",
                    },
                  ],
                },
                {
                  type: "bulletList",
                  content: [
                    {
                      type: "listItem",
                      content: [
                        {
                          type: "paragraph",
                          content: [
                            {
                              type: "text",
                              text: "Node.js 20 or later",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "listItem",
                      content: [
                        {
                          type: "paragraph",
                          content: [
                            {
                              type: "text",
                              text: "npm 10 or later",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "listItem",
                      content: [
                        {
                          type: "paragraph",
                          content: [
                            {
                              type: "text",
                              text: "At least 4 GB of available memory",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            children: [
              {
                id: "doc-1-2-1-1",
                title: "Node.js Setup",
                slug: "node-js-setup",
                parentId: "doc-1-2-1",
                content: {
                  type: "doc",
                  content: [
                    {
                      type: "heading",
                      attrs: { level: 1 },
                      content: [{ type: "text", text: "Node.js Setup" }],
                    },
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Install Node.js from the official distribution or through your operating system's package manager.",
                        },
                      ],
                    },
                    {
                      type: "heading",
                      attrs: { level: 2 },
                      content: [{ type: "text", text: "Verify Installation" }],
                    },
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "After installation, verify that Node.js is available from your terminal.",
                        },
                      ],
                    },
                    {
                      type: "codeBlock",
                      attrs: { language: "bash" },
                      content: [
                        {
                          type: "text",
                          text: "node --version\nnpm --version",
                        },
                      ],
                    },
                    {
                      type: "blockquote",
                      content: [
                        {
                          type: "paragraph",
                          content: [
                            {
                              type: "text",
                              text: "Restart your terminal after installing Node.js if the commands are not recognized.",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            id: "doc-1-2-2",
            title: "Configuration",
            slug: "configuration",
            parentId: "doc-1-2",
            content: {
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: "Configuration" }],
                },
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Configure the application using environment variables and project settings.",
                    },
                  ],
                },
                {
                  type: "heading",
                  attrs: { level: 2 },
                  content: [{ type: "text", text: "Environment Variables" }],
                },
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Create an environment file and add the required configuration values.",
                    },
                  ],
                },
                {
                  type: "codeBlock",
                  attrs: { language: "env" },
                  content: [
                    {
                      type: "text",
                      text: "DATABASE_URL=your_database_url\nJWT_SECRET=your_secret",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        id: "doc-1-3",
        title: "Quickstart",
        slug: "quickstart",
        parentId: "doc-1",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Quickstart" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Get your first documentation project running in just a few steps.",
                },
              ],
            },
            {
              type: "orderedList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Install the dependencies." }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Configure the environment." }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Start the development server." }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "doc-2",
    title: "API Reference",
    slug: "api-reference",
    parentId: null,
    icon: "Code2",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "API Reference" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "This section contains technical information about the available API resources and endpoints.",
            },
          ],
        },
      ],
    },
    children: [
      {
        id: "doc-2-1",
        title: "Authentication",
        slug: "authentication",
        parentId: "doc-2",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Authentication" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "API requests require a valid authentication token.",
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Bearer Token" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Include the token in the Authorization header of your request.",
                },
              ],
            },
            {
              type: "codeBlock",
              attrs: { language: "http" },
              content: [
                {
                  type: "text",
                  text: "Authorization: Bearer <token>",
                },
              ],
            },
          ],
        },
      },
      {
        id: "doc-2-2",
        title: "Endpoints",
        slug: "endpoints",
        parentId: "doc-2",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "API Endpoints" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The API exposes endpoints for managing users and documentation resources.",
                },
              ],
            },
          ],
        },
        children: [
          {
            id: "doc-2-2-1",
            title: "Users",
            slug: "users",
            parentId: "doc-2-2",
            content: {
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: "Users" }],
                },
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Use the Users endpoints to retrieve and manage user information.",
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "doc-2-2-2",
            title: "Documents",
            slug: "documents",
            parentId: "doc-2-2",
            content: {
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: "Documents" }],
                },
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Use the Documents endpoints to create, retrieve, update, and delete documentation resources.",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
];