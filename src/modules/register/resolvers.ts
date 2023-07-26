import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import * as bcrypt from "bcrypt";
import { registerSchema } from "../../utils/validators";
import { formatYupError } from "../../utils/formatYupError";
import { duplicateEmail } from "./errorMessages";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";

const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments, { url, redisClient }) => {
      try {
        await registerSchema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;


      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });

      if (userAlreadyExists) {
        return [{
          path: "email",
          message: duplicateEmail
        }];
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword
      })
        
      await user.save();

      await createConfirmEmailLink(url, user.id, redisClient);

      return null;
    }
  }
};

export default resolvers;