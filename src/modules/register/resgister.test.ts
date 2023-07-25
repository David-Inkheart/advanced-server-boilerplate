import { faker } from '@faker-js/faker';
import { request } from 'graphql-request';
import * as dotenv from "dotenv";
import { User } from '../../entity/User';

import { startServer } from '../../startServer';
import { duplicateEmail, badEmail, badPassword} from './errorMessages';

dotenv.config();
let getHost = () => "";

beforeAll(async () => {
  await startServer();
  getHost = () => process.env.TEST_HOST as string;
});

const email = faker.internet.email();
const email2 = "b@.com";
const password = faker.internet.password();
const password2 = "gh";

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

describe('Register user', () => {
  it('should check that user registers successfuly', async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it('should check that same email cannot be registered twice', async () => {
    const response2: any = await request(getHost(), mutation(email, password));
    expect(response2).toEqual({
      register: [{
        path: "email",
        message: duplicateEmail
      }]
    });
  });

  it("should check for invalid email", async () => {
    const response3: any = await request(getHost(), mutation(email2, password));
    expect(response3).toEqual({
      register: [{
        path: "email",
        message: badEmail
      }]
    });
  });

  it("should check for invalid password", async () => {
    const response4: any = await request(getHost(), mutation(email, password2));
    expect(response4).toEqual({
      register: [{
        path: "password",
        message: badPassword
      }]
    });
  });

  it("should check for bad email and bad password", async () => {
    const response5: any = await request(getHost(), mutation(email2, password2));
    expect(response5).toEqual({
      register: [{
        path: "email",
        message: badEmail
      }, {
        path: "password",
        message: badPassword
      }]
    });
  });
});
