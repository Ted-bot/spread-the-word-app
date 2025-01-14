"use server";

import { unique } from "next/dist/build/utils";

const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
  };

export default async function twitterApi(state: any, payload: FormData) {

    const userCredentials = {
        password: payload.get("password") as string,
        userid : payload.get("userid") as string
    };

    if(
        !userCredentials.password ||
        !userCredentials.userid
    ){
        return 'invalid input'
    }

    // "x-oauth_token":process.env.TWITTER_CONSUMER_API_KEY,
    // "x-oauth_token_secret":process.env.TWITTER_CONSUMER_API_KEY

    const convert64base = (userCredentials: {password: string, userid: string}) => {
        if(!userCredentials.password || !userCredentials.userid) return 
        
        return btoa(`${userCredentials.password}:${userCredentials.userid}`);
    }
    const authorizationUser = convert64base(userCredentials);
    const UniqueId = uniqueId();

    const currentDate = new Date(); 
    const timestamp = currentDate. getTime();
    const requestUrl = "https://api.x.com/2/oauth2/token";


    const headerCredentials = {
        include_entities        : "true",
        oauth_consumer_key      : process.env.TWITTER_CONSUMER_API_KEY || "",
        oauth_nonce             : UniqueId || "",
        oauth_signature_method  : "HMAC-SHA1",
        oauth_timestamp         : `${timestamp}` || "",
        oauth_token             : process.env.TWITTER_CONSUMER_ACCESS_TOKEN || "",
        oauth_version           : "1.0",
        status                  : "User Signed X Signature",
    }

    const urlSearchParams = new URLSearchParams(headerCredentials);

    console.log({twitter_signature: urlSearchParams});
    // const urlSearchParams = new URLSearchParams({
    //     code: userCredentials.password || "" ,
    //     client_id: process.env.CLIENT_ID || "",
    //     grant_type:"authorization_code",
    //     redirect_uri: `https://www.localhost:3000&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain` ,
    //     code_verfier: ""
    //     // "oauth_token": process.env.TWITTER_CONSUMER_API_KEY || "",
    //     // "oauth_token_secret": process.env.TWITTER_CONSUMER_API_KEY_SECRET || "",
    // });
    const twitterSignature = () => {
        return `POST&${requestUrl}&${urlSearchParams}`
    }

    const signature = twitterSignature();

    const getUserAuthorization = await fetch("",{
        method: "POST",
        headers: {
            Authorization           : `Basic ${authorizationUser}`,
            "Content-Type"          : "application/x-www-form-urlencoded",
            oauth_signature         : signature,
            ...headerCredentials,
        },
        // body: urlSearchParams
    })

    console.log({twitterResponse: getUserAuthorization});

   return JSON.stringify(getUserAuthorization);
}