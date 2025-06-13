/**
 * This script checks the GitHub Pages configuration in docusaurus.config.ts
 * and provides guidance on setting up GitHub Pages deployment.
 */

const fs = require("fs");
const path = require("path");

// Read the docusaurus.config.ts file
const configPath = path.join(__dirname, "..", "docusaurus.config.ts");
const configContent = fs.readFileSync(configPath, "utf8");

// Extract the GitHub Pages configuration
const baseUrlMatch = configContent.match(/baseUrl:\s*["']([^"']+)["']/);
const orgNameMatch = configContent.match(/organizationName:\s*["']([^"']+)["']/);
const projectNameMatch = configContent.match(/projectName:\s*["']([^"']+)["']/);
const deploymentBranchMatch = configContent.match(/deploymentBranch:\s*["']([^"']+)["']/);

// Display the configuration
console.log("GitHub Pages Configuration:");
console.log("-------------------------");
console.log(`Base URL: ${baseUrlMatch ? baseUrlMatch[1] : "Not found"}`);
console.log(`Organization Name: ${orgNameMatch ? orgNameMatch[1] : "Not found"}`);
console.log(`Project Name: ${projectNameMatch ? projectNameMatch[1] : "Not found"}`);
console.log(`Deployment Branch: ${deploymentBranchMatch ? deploymentBranchMatch[1] : "Not found"}`);
console.log("-------------------------");

// Check for potential issues
const issues = [];

if (!baseUrlMatch || !baseUrlMatch[1].startsWith("/")) {
	issues.push("- Base URL should start with a forward slash (/)");
}

if (!baseUrlMatch || !baseUrlMatch[1].endsWith("/")) {
	issues.push("- Base URL should end with a forward slash (/)");
}

if (!orgNameMatch || !orgNameMatch[1]) {
	issues.push("- Organization name is missing");
}

if (!projectNameMatch || !projectNameMatch[1]) {
	issues.push("- Project name is missing");
}

if (!deploymentBranchMatch || deploymentBranchMatch[1] !== "gh-pages") {
	issues.push('- Deployment branch should be set to "gh-pages"');
}

// Display issues or success message
if (issues.length > 0) {
	console.log("\nPotential issues found:");
	issues.forEach((issue) => console.log(issue));
	console.log("\nPlease fix these issues in your docusaurus.config.ts file.");
} else {
	console.log("\nNo issues found with your GitHub Pages configuration!");
}

console.log("\nReminder: Make sure GitHub Pages is enabled in your repository settings:");
console.log("1. Go to your repository on GitHub");
console.log("2. Navigate to Settings > Pages");
console.log('3. Set the source to "GitHub Actions"');
