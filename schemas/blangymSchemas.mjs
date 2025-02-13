import z from 'zod';

const VALUES = ["Chest", "Back", "Legs", "Shoulders", "Arms"]

const exercisesTrakerSchema = z.object({
 userName: z.string().max(50, { message: "Max Charapters 50", invalit_type_error: "Error In The User Name"}),
 date: z.string().max(20, { message: "Max date digits 10", invalit_type_error: "Error In Date"}),
 muscleGroup: z.enum(VALUES, { invalid_type_error: "It`s an enum, cam`t add anything else"}),
 weight: z.number().max(500, {message: "Max Characters 500", invalid_type_error: "Must Be A Number Weight"}),
 reps: z.number().int().max(100, {message: "Max Characters 100", invalid_type_error: "Must Be A Number Reps"}),
 rest: z.number().max(500, {message: "Max Characters 500", invalid_type_error: "Must Be A Number Res"}),
 notes: z.string().max(100, {message: "Max Characters 100", invalid_type_error: "Must Be String"}).optional()
});

export function exerciseTrakerSchema(object){
 return exercisesTrakerSchema.safeParse(object)
}