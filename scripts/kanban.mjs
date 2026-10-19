#!/usr/bin/env node
// Veil Kanban helper - move GitHub issues between board statuses.
// Usage:
//   node scripts/kanban.mjs                     (list board statuses + items)
//   node scripts/kanban.mjs <issue-number> <status-name>   (move a ticket)
// Token: GITHUB_PROJECTS_TOKEN env var, or GITHUB_PROJECTS_TOKEN=... in .env

import { readFileSync, existsSync } from "node:fs";

const OWNER = process.env.GITHUB_PROJECT_OWNER ?? "shadoo77";
const PROJECT_NUMBER = Number(process.env.GITHUB_PROJECT_NUMBER ?? 3);

function loadToken() {
  if (process.env.GITHUB_PROJECTS_TOKEN) return process.env.GITHUB_PROJECTS_TOKEN;
  if (existsSync(".env")) {
    const match = readFileSync(".env", "utf8").match(/^GITHUB_PROJECTS_TOKEN=(.+)$/m);
    if (match) return match[1].trim();
  }
  console.error("No token found. Set GITHUB_PROJECTS_TOKEN or add GITHUB_PROJECTS_TOKEN=... to .env");
  process.exit(1);
}

async function gql(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${loadToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL error:", JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }
  return json.data;
}

const PROJECT_QUERY = `query($owner: String!, $number: Int!) {
  user(login: $owner) {
    projectV2(number: $number) {
      id
      title
      fields(first: 20) {
        nodes {
          __typename
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
        }
      }
      items(first: 100) {
        nodes {
          id
          content {
            __typename
            ... on Issue {
              number
              title
            }
          }
        }
      }
    }
  }
}`;

const MOVE_MUTATION = `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { singleSelectOptionId: $optionId }
    }
  ) {
    projectV2Item { id }
  }
}`;

const { user } = await gql(PROJECT_QUERY, { owner: OWNER, number: PROJECT_NUMBER });
const project = user.projectV2;
if (!project) {
  console.error(`Project ${OWNER}/${PROJECT_NUMBER} not found (token needs project access)`);
  process.exit(1);
}

const statusField = project.fields.nodes.find((f) => f.__typename === "ProjectV2SingleSelectField");
if (!statusField) {
  console.error("No single-select status field found on the project");
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--list") {
  console.log(`Project: ${project.title} (${OWNER}/projects/${PROJECT_NUMBER})`);
  console.log(`\nStatuses ("${statusField.name}" field):`);
  for (const option of statusField.options) console.log(`  - ${option.name}`);
  console.log("\nItems:");
  for (const item of project.items.nodes) {
    const issue = item.content;
    if (issue?.number) console.log(`  #${issue.number}: ${issue.title}`);
  }
  process.exit(0);
}

if (args.length !== 2) {
  console.error("Usage: node scripts/kanban.mjs [<issue-number> <status-name>]");
  process.exit(1);
}

const issueNumber = Number(args[0]);
const statusName = args[1].toLowerCase();

const option = statusField.options.find((o) => o.name.toLowerCase() === statusName);
if (!option) {
  console.error(
    `Unknown status "${args[1]}". Available: ${statusField.options.map((o) => o.name).join(", ")}`,
  );
  process.exit(1);
}

const item = project.items.nodes.find((i) => i.content?.number === issueNumber);
if (!item) {
  console.error(`Issue #${issueNumber} is not on the board (auto-add should put it there)`);
  process.exit(1);
}

await gql(MOVE_MUTATION, {
  projectId: project.id,
  itemId: item.id,
  fieldId: statusField.id,
  optionId: option.id,
});

console.log(`Moved #${issueNumber} -> "${option.name}"`);
