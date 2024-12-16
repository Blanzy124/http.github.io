import z from 'zod';

const comentsSchema = z.object({
 coment: z.string({
  invalid_type_error: 'Cant use only numbers'
 }),
 name: z.string({
  invalid_type_error: 'Cant use only numbers'
 }),
 age: z.number({
  invalid_type_error: 'Can use only numbers'
 }).int()

})

export function comentSchema (object){
 return comentsSchema.safeParse(object)
}

export function comentSchemmaPartial(object) {
 return comentsSchema.partial().safeParse(object)
}
