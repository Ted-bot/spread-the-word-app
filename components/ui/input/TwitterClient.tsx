"use client";

import { useActionState } from "react";

import twitterApi from "@/actions/twitterApi";
import UserCredentials from "./UserCredentials";

const initialState = JSON.stringify({ sender: "John", response: "Hello", id: "123" });

export default function TwitterClient(){

    const [state, formAction, isPending] = useActionState(twitterApi, initialState);

    return (
        <form action={formAction} className="flex flex-col justify-center  w-auto border-4 p-4 border-orange-400 rounded-lg">
            <h4 className="text-center mb-4">login to twitter account</h4>
            <UserCredentials />
            <section className="flex justify-center ">
                <button className="bg-red-300 transition duration-500 ease-in-out rounded-lg mt-4 p-2 transform hover:-translate-y-1 hover:scale-110 hover:bg-red-600 hover:border-yellow-400 hover:border-4">Submit Button</button>
            </section>
        </form>
    )
}