import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const communitySidebars: SidebarsConfig = {

	// Community sidebar
	communitySidebars: [
		{
			type: "doc",
			id: "community-overview",
			label: "Overview"
		},
		{
			type: "doc",
			id: "contribution-guidelines",
			label: "Contribution Guidelines"
		},
		{
			type: "doc",
			id: "areas-needing-contributions",
			label: "Areas Needing Help"
		},
		{
			type: "doc",
			id: "documentation-standards",
			label: "Documentation Standards"
		},
		{
			type: "doc",
			id: "coding-standards",
			label: "Coding Standards"
		},
		{
			type: "doc",
			id: "review-process",
			label: "Review Process"
		},
		{
			type: "doc",
			id: "code-of-conduct",
			label: "Code of Conduct"
		},
		{
			type: "doc",
			id: "issue-template",
			label: "Issue Template"
		},
		{
			type: "doc",
			id: "pr-template",
			label: "PR Template"
		}
	]
};

export default communitySidebars;
