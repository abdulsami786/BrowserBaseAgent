import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_jywfcpbqwgqtsfxztabx",
  // Only the tasks folder — every file in `dirs` is bundled, so pointing at all
  // of `features` would pull in React components and server actions too.
  dirs: ["./features/workflows/tasks"],
  maxDuration: 3600,
});
