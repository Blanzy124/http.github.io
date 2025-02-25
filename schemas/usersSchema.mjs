import z from 'zod';

const forbiddenChars = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
const escapedForbiddenChars = forbiddenChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
const regex = new RegExp(`^[^${escapedForbiddenChars}]+$`);

const VALUES = ['admin', 'midadmin', 'user']

const userSchema = z.object({
 name: z.string().max(20, {message: "Max Characters 20"}).regex(regex, "No Special Characters"),
 userPassword: z.string().max(20, {message: "Max Characters 20"}),
 //userStatus: z.enum(VALUES, { message: "Only admin, midadmin and user value"})
})

export function newUserSchema(object){
 return userSchema.safeParse(object)
}