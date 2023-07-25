import bcrypt from "bcrypt";

export async function validatePassword(password, attemptedPassword) {
  const compare = await bcrypt.compare(attemptedPassword, password);
  if(!compare)
    throw new Error('not validated');
}