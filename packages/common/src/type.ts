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
   room_name:z.string().min(2).max(16)
})