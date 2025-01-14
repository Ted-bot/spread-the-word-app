"use client";

import { useActionState } from "react";
import type { initialCredentialState } from "@/components/types/UserCredentialType";
import twitterApi from "@/actions/twitterApi";

const initialState = JSON.stringify({ sender: "John", response: "Hello", id: "123" });

export const UserInput = (initialState:initialCredentialState) => (<p>
        <label htmlFor={initialState.name}>{initialState.labelName}</label>
        <input type="text" id={initialState.id} required/>
</p>);

export default function UserCredentials(){

    const [state, formAction, isPending] = useActionState(twitterApi, initialState);

    const userInputs = {
        name: "",
        labelName: "",
        id: ""
    }

    return (
        <div className="text-center">
            <UserInput name={"userid"} labelName={"Your username"} id={"1"}  />
            <UserInput name={"password"} labelName={"Your password"} id={"2"} />
        </div>
    )
}