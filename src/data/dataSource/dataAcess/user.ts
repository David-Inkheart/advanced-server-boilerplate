import { User } from "../../../entity/User";

// create a user
export const createUser = async (email: string, password: string, confirmed: boolean = false) => {
  return await User.create({
    email,
    password,
    confirmed,
  }).save();
}

// update a user  with supplied id and parameters/
export const updateUser = async (id: string, properties: any = {}) => {
  return await User.update({ id }, properties);
}

// update a user with supplied email and properties to update
export const updateUserByEmail = async (email: string, properties: any = {}) => {
  return await User.update({ email }, properties);
}

// delete a user
export const deleteUser = async (id: string) => {
  return await User.delete({ id });
}

// get a user with any supplied property
export const getUser = async (property: any = {}) => {
  return await User.findOneBy(property);
}

// get all users
export const getAllUsers = async () => {
  return await User.find();
}
