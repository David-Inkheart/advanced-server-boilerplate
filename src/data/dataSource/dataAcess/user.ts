import { User } from "../../../entity/User";

// create a user
export const createUser = async (email: string, password: string, confirmed: boolean = false) => {
  return await User.create({
    email,
    password,
    confirmed,
  }).save();
}

// update a with supplied properties
export const updateUser = async (id: string, properties: any = {}) => {
  return await User.update({ id }, properties);
}

// delete a user
export const deleteUser = async (id: string) => {
  return await User.delete({ id });
}

// get a user
export const getUser = async (id: string) => {
  return await User.findOne({ where: { id } });
}

// get all users
export const getAllUsers = async () => {
  return await User.find();
}
