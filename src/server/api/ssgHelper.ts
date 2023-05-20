import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "./root";
import superjson from "superjson";
import { createInnerTRPCContext } from "./trpc";

export function ssgHelper() {
  return createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null, revalidateSSG: null }),
    transformer: superjson,
  });
}
