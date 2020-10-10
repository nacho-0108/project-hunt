import {useContext} from "react";
import AuthContext from "../src/AuthContext";
import PageLayout from "./PageLayout";
import {useRouter} from "next/router";

export default function ({children}) {
    const {authState} = useContext(AuthContext)
    const router = useRouter()

    if (authState === 1) {
        return <>{children}</>
    } else {
        router.push('/signin')
        return <PageLayout isLoading={true}/>
    }

}