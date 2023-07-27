// export const confirmEmail = async (req, res) => {
//   const { id } = req.params;
//   const userId = await redisClient.get(id);
//   if (userId) {
//     await User.update({ id: userId }, { confirmed: true });
//     await redisClient.del(id);
//     res.send('ok');
//   } else {
//     res.send('invalid');
//   }
// };