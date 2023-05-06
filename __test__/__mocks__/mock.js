import { setupServer } from "msw/node";
import handlers from "../handler";

const server = setupServer(...handlers);

module.exports = "test-file-stub";

export default server;
