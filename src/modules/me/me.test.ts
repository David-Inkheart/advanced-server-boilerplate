import axios from 'axios';
// import { faker } from '@faker-js/faker';
// import { redisClient } from '../../data/redis/redisClient';
import { DataSource } from 'typeorm';
import { createDataSourceConn } from '../../data/dataSource/dataSourceConn';
import { createUser } from '../../data/dataSource/dataAcess/user';

let userId: string;
let conn: DataSource;
const email = "newUser@email.com";
const password = "123456"

beforeAll(async () => {
  conn = await createDataSourceConn();
  const user = await createUser(email, password, true);
  userId = user.id;
});

afterAll(async () => {
  await conn.destroy();
});

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

const meQuery = `
  {
    me {
      id
      email
    }
  }
`;

describe('me', () => {
  // it("should not get user if not logged in", async () => {
  //   // make request to graphql server
  // });

  it("should get current user", async () => { 
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password),
      },
      {
        withCredentials: true,
      }
    );
    // console.log(loginResponse.data.data);
    const response = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery,
      },
      {
        withCredentials: true,
      }
    );
    // console.log(response.data.data);
    expect(response.data.data).toEqual({
      me: {
        id: userId,
        email,
      }
    });
  });
});