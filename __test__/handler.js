import { rest } from "msw";

const handlers = [
  rest.get("https://localhost:3000/audio-file.mp3", (req, res, ctx) => {
    return res(ctx.status(200), ctx.body("mocked-audio-file-content"));
  }),
];

export default handlers;
