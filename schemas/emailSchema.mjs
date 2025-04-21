import z from 'zod';


const emailSchema = z.object({
 userEmail: z.string().max(150, {message: "Max Characters 150"}).email({ message: "Invalid email address" })
 //userStatus: z.enum(VALUES, { message: "Only admin, midadmin and user value"})
})

export function newEmailSchema(object){
 return emailSchema.safeParse(object)
}