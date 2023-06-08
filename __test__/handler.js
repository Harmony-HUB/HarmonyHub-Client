import { rest } from "msw";

const handlers = [
  rest.get(
    `${process.env.REACT_APP_API_URL}/audio-file.mp3`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.body("mocked-audio-file-content"));
    }
  ),
];

export default handlers;
