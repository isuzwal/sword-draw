import { z} from "zod"

export const SignupScheam=z.object({
    username:z.string().min(3).max(12),
    password:z.string(),
    email:z.string().email()
})
export const LoginScheam=z.object({
    password:z.string(),
    email:z.string().email()
})
export const CreateRoomSchema=z.object({
   name:z.string().min(6).max(16)
})