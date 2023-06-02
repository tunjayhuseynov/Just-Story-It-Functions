import { auth } from "firebase-functions";




export const SignUpNewUser = auth.user().onCreate((user) => {
    
})