// import { z } from 'zod';

// export const certificateSchema = z.object({
//     nameEmisor: z.string({
//         required_error: "Name emisor is required",
//         invalid_type_error: "Name emisor must be a string"
//     }).min(3, "Name emisor must be at least 3 characters")
//       .max(50, "Name emisor must be less than 50 characters")
//       .optional(),

//     fechaEmision: z.coerce.date({
//         required_error: "Fecha emision is required",
//         invalid_type_error: "Fecha emision must be a valid date"
//     }).min(new Date('2000-01-01'), "Date must be after year 2000")
//       .max(new Date(), "Date cannot be in the future"),

//     codigoVerify: z.string({
//         required_error: "Codigo verify is required",
//         invalid_type_error: "Codigo verify must be a string"
//     }).min(5, "Verification code must be at least 5 characters")
//       .max(20, "Verification code must be less than 20 characters"),

//     isActive: z.boolean({
//         required_error: "isActive is required",
//         invalid_type_error: "isActive must be a boolean"
//     }).default(true),

//         // usuario: z.string({
//         //     required_error: "Usuario ID is required",
//         //     invalid_type_error: "Usuario ID must be a string"
//         // }).regex(/^[0-9a-fA-F]{24}$/, "Invalid Usuario ID format").optional(),

//         // curso: z.string({
//         //     required_error: "Curso ID is required",
//         //     invalid_type_error: "Curso ID must be a string"
//         // }).regex(/^[0-9a-fA-F]{24}$/, "Invalid Curso ID format").optional(),

//         // estudiante: z.string({
//         //     required_error: "Estudiante ID is required",
//         //     invalid_type_error: "Estudiante ID must be a string"
//         // }).regex(/^[0-9a-fA-F]{24}$/, "Invalid Estudiante ID format").optional()
// });

// export const updateCertificateSchema = certificateSchema.partial();

// export const idSchema = z.object({
//     id: z.string({
//         required_error: "ID is required",
//         invalid_type_error: "ID must be a string"
//     }).regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")
// });
