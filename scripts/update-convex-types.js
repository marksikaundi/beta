// Script to generate Convex API types after changes
console.log("Starting Convex type generation...");
console.log(
  "Please run this command in your terminal to generate Convex API types:"
);
console.log("\npnpx convex dev\n");
console.log(
  "This will start the Convex development server and generate the API types."
);
console.log(
  "Once it's running, the labs_seed module will be properly included in the generated API."
);
console.log(
  "\nAfter the types are generated, you should be able to use useAction(api.labs_seed.seedChallenges) in your code."
);
