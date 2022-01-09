import { IncomingMessage, ServerResponse } from "http";

const _1week = 7 * 24 * 60 * 60;
export const maxAgeCacheControl =
  (seconds: number = _1week) =>
  async (req: IncomingMessage, res: ServerResponse, next: () => any) => {
    res.setHeader(
      "Cache-Control",
      `s-maxage=${seconds}, stale-while-revalidate`
    );
    await next();
  };
