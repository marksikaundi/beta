const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Function to check if _generated directory exists
function checkGeneratedDirExists() {
  const generatedDir = path.join(__dirname, "..", "convex", "_generated");
  return fs.existsSync(generatedDir);
}

// Function to run the convex command
function runConvexGenerate() {
  try {
    console.log("Generating Convex API types...");
    execSync("npx convex run", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
    console.log("Convex API types generated successfully!");

    // Verify that the generation worked
    if (checkGeneratedDirExists()) {
      console.log(
        "_generated directory exists. Type generation was successful."
      );
      return true;
    } else {
      console.error(
        "_generated directory does not exist. Type generation may have failed."
      );
      return false;
    }
  } catch (error) {
    console.error("Error generating Convex API types:", error.message);
    return false;
  }
}

// Main function
function main() {
  console.log("Starting Convex API type generation script...");

  if (checkGeneratedDirExists()) {
    console.log(
      "_generated directory already exists. No need to regenerate types."
    );
    return;
  }

  const success = runConvexGenerate();

  if (success) {
    console.log("Script completed successfully.");
  } else {
    console.error(
      "Script failed to generate types. Please check the errors above."
    );
    process.exit(1);
  }
}

main();
