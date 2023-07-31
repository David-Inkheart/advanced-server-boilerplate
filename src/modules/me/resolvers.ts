import { ResolverMap } from "../../types/graphql-utils";
import { getUser } from "../../data/dataSource/dataAcess/user";
import { createMiddleWare } from "../../utils/createMiddleWare";
import middleware from "./middleware";

const resolvers: ResolverMap = {
  Query: {
    me: createMiddleWare(middleware, (
      async (_, __, { session }) => {
        return await getUser(session.userId);
      }
    )),
  },
};

export default resolvers;