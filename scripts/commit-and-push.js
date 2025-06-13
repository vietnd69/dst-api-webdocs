/**
 * This script helps commit and push changes to GitHub.
 * It's a simple wrapper around git commands.
 */

const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Get commit message from user
rl.question("Enter commit message: ", (commitMessage) => {
	if (!commitMessage) {
		console.error("Commit message cannot be empty");
		rl.close();
		return;
	}

	try {
		// Stage all changes
		console.log("Staging changes...");
		execSync("git add .", { stdio: "inherit" });

		// Commit changes
		console.log("Committing changes...");
		execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

		// Ask if user wants to push changes
		rl.question("Push changes to GitHub? (y/n): ", (answer) => {
			if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
				console.log("Pushing changes to GitHub...");
				execSync("git push", { stdio: "inherit" });
				console.log("Changes pushed successfully!");
			} else {
				console.log("Changes committed but not pushed.");
			}
			rl.close();
		});
	} catch (error) {
		console.error("Error:", error.message);
		rl.close();
	}
});
