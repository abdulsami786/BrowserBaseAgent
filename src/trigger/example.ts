import { logger, task } from "@trigger.dev/sdk";

export const helloWorldTask = task({
  id: "hello-world",
  run: async (payload: { name?: string }) => {
    logger.log("Hello, world!", { payload });
    return { message: `Task, ${payload.name ?? "world"}!` };
  },
});
