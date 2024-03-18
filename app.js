import { createBot } from "whatsapp-cloud-api";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
const app = express();

app.use(cors());
app.use(morgan("dev"));

dotenv.config();

const from = process.env.FROM;
const token = process.env.TOKEN;
const to = process.env.TO;
const webhookVerifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

(async () => {
  try {
    // Create a bot that can send messages
    const bot = createBot(from, token);

    // const result = await bot.sendText(to, 'Hello world');

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken: webhookVerifyToken,
      port: 3000,
      useMiddleware: (app) => {
        app.get("/", (req, res) => {
          return res.send(200);
        });
        app.use(cors());
        app.use(morgan("dev"));
      },
    });



    bot.on("text", async (msg) => {
      console.log(msg);
      await bot.sendText(msg.from, "Received your text!");
    });

  } catch (err) {
    console.log(err);
  }
})();
