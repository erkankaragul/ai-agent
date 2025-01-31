import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import {
  goalDescriptionGeneratorHandler,
  goalGeneratorHandler,
} from "./controllers";
import {
  goalDescriptionGeneratorAPIDetails,
  goalGeneratorAPIDetails,
  healthAPIDetails,
} from "./lib/swagger";
import { rateLimit } from "elysia-rate-limit";
import { env } from "./env";
import { rateLimitKeyGenerator } from "./utils";

export const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Talent Protocol AI API",
          version: "1.0.0",
          description:
            "Welcome to the Swagger documentation for the AI API of Talent Protocol. You can generate goals based on the user profile info (bio and interests) or generate descriptions of goals using AI.",
        },
        tags: [
          {
            name: "AI",
            description: "Endpoints for interacting with AI",
          },
        ],
      },
    })
  )
  .use(
    rateLimit({
      duration: env.RATE_LIMIT_DURATION,
      max: env.RATE_LIMIT_MAX,
      generator: rateLimitKeyGenerator,
    })
  )
  .group("/api/v0", (app) =>
    app
      .get(
        "health",
        () =>
          new Response(JSON.stringify({ response: "I'm alive!" }), {
            status: 200,
          }),
        healthAPIDetails
      )
      .group("/ai", (aiGroup) =>
        aiGroup
          .post("/goals", goalGeneratorHandler, goalGeneratorAPIDetails)
          .post(
            "/description",
            goalDescriptionGeneratorHandler,
            goalDescriptionGeneratorAPIDetails
          )
      )
  )
  .listen(env.PORT);

console.log(`⚡️ ElysiaJS server started on port ${env.PORT}.`);
