import { useEffect } from "react";
import { auth } from "../database/Firebase";
import { signInAnonymously } from "firebase/auth";

const useAnonymousSignIn = () => {
    useEffect(() => {
        const signIn = async () => {
            try {
                if(!auth.currentUser){
                    console.log("no curentUser, so sign in Anon");
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Error signing in anonymously:", error);
            }
        };

        signIn();
    }, []);
};

export default useAnonymousSignIn;