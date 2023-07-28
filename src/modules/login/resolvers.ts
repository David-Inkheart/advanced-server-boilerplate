import { ResolverMap } from "../../types/graphql-utils";
import { MutationLoginArgs } from "../../generated-types/graphql";
import { registerSchema as loginSchema } from "../../utils/validators";
import { formatYupError } from "../../utils/formatYupError";
import { getUser } from "../../data/dataSource/dataAcess/user";
import { confirmEmailError, invalidLogin } from "./errorMessages";
import { comparePasswords } from "../../utils/passwordService";

const loginError = [{
  path: "email",
  message: invalidLogin
}];


const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _, {email, password}: MutationLoginArgs,
      // { url, redisClient }
    ) => {
      try {
        await loginSchema.validate({email, password}, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }
      
      const user = await getUser({ email });

      if (!user) {
        return loginError;
      }

      if (!user.confirmed) {
        return [{
          path: "email",
          message: confirmEmailError
        }];
      }

      const isMatch = await comparePasswords(password, user.password);

      if (!isMatch) {
        return loginError;
      }

      return null;
    }
  }
};

export default resolvers;