"use server";

import {
    // AzureKeyCredential,
    // ChatRequestMessage,
    // OpenAIClient
} from "@azure/openai";

import mime from "mime";
import { createReadStream, PathLike } from "fs";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
// import _ from "lodash";

import { AzureOpenAI } from "openai";
import { ChatCompletionMessageParam as ChatRequestMessage } from "openai/resources/index.mjs";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
// import { 
// import { FormData } from '../node_modules/openai/_shims/node-types.d';
//   DefaultAzureCredential, 
//   getBearerTokenProvider 
// } from "@azure/identity";


const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const apiVersion = process.env.AZURE_API_VERSION;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME; //This must match your deployment name.

// keyless authentication    
const credential = new DefaultAzureCredential();
const scope = "https://cognitiveservices.azure.com/.default";
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

// const deployment = "gpt-4o"; //This must match your deployment name.
function getClient(): AzureOpenAI {
    return new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
        deployment: deploymentName,
    });
  }
  

// async function transcript(state: { sender: string; response: string; id?: undefined; }, initialState: {}, formData: FormData) {
async function transcript(state: any, payload: FormData) {
// async function transcript(state: any, audioFilePath: PathLike) {
    console.log({"PREVIOUS STATE:" : state, payload});
    console.log("env AZURE_ENDPOINT", process.env.AZURE_ENDPOINT);
    console.log("env AZURE_DEPLOYMENT_NAME", process.env.AZURE_DEPLOYMENT_NAME);
    console.log("env AZURE_DEPLOYMENT_COMPLETION_NAME", process.env.AZURE_DEPLOYMENT_COMPLETION_NAME);



    if(
        process.env.AZURE_API_KEY === undefined ||
        process.env.AZURE_ENDPOINT === undefined ||
        process.env.AZURE_DEPLOYMENT_NAME === undefined ||
        process.env.AZURE_DEPLOYMENT_COMPLETION_NAME === undefined
    ){
        console.error("Azure credentials not set");

        return  "Azure credentials not set";
        // {
        //     sender: "",
        //     response: "Azure credentials not set"
        // };
    }

    // const audioFilePath = "<audio file path>";
    let audioFilePath = "<audio file path>";

    const file = payload.get("audio") as File;


    if(file.size === 0){
        return "No audio file provided";
        // {
        //     sender: "",
        //     response: "No audio file provided"
        // };
    }

    //store file

    console.log("file: >> ", file);

    // return "trese";

    const arrayBuffer = await file.arrayBuffer();
    
    // store to a directory
    const buffer = Buffer.from(arrayBuffer);
    const relativeUploadDir = `/uploads/${new Date(Date.now()).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
    .replace(/\//g, "-")}`;

    // prepare for upload sound file
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    try {
        // This is for checking the directory is exist
        await stat(uploadDir);
      } catch (e: any) {
        if (e.code === "ENOENT") {
          // If the directory doesn't exist (ENOENT : Error No Entry), create one
          await mkdir(uploadDir, { recursive: true });
        } else {
          console.error(
            "Error while trying to create directory when uploading a file\n",
            e
          );
          return  "Something went wrong.";
        }
      }

    //   function getFileExtension(filename: String) {
    //     return filename.split('.').pop();
    // }

    function getFileExtension(filename: String) {
      const dotIndex = filename.lastIndexOf(".");
      const slashIndex = filename.lastIndexOf("/"); // For paths
      return dotIndex > slashIndex ? filename.substring(dotIndex + 1) : "";
  }

      try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // const filename = `${file.name.replace(
        audioFilePath = `${file.name.replace(
          /\.[^/.]+$/,
          ""
        )}-${uniqueSuffix}.${getFileExtension(file.name)}`;
        // )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
        await writeFile(`${uploadDir}/${audioFilePath}`, buffer);
      } catch (e) {
        console.error("Error while trying to upload a file\n", e);
        return "Something went wrong.";
      }


    const audio = new Uint8Array(arrayBuffer);
    
    // ---- getaudio transcript from Azure Whisper AI service ----
    console.log("== Transcibe Audio Sample");
    console.log(`stored audio file >> ${uploadDir}/${audioFilePath}`);

    const client = getClient();
    const result = await client.audio.transcriptions.create({
        model: "", // ssm-siri-assistent-35-turbo / gpt-3.5-turbo-1106
        // model: process.env.AZURE_DEPLOYMENT_NAME, // gpt-3.5-turbo-1106 
        file: createReadStream(`${uploadDir}/${audioFilePath}`),
    });

    // console.log(`Transcription: ${result.text}`);

    // const messages: ChatRequestMessage[] = [
    //     {
    //         role: "system",
    //         content: 
    //             "You are a helpful assistant. You will answer questions and reply I cannot answer that if you dont know the answer."
    //     },
    //     {
    //         role: "user",
    //         content: result.text
    //     }
    // ];

    // const completions = await client.chat.completions.create({
    //     model: process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME, //gpt-3.5-turbo-1106
    //     messages: messages
    // });

    // const response = completions;

    // console.log({sender: state.sender, response: response})

    const id = Math.random().toString(36);

    console.log({user_post: result.text});
    // return result.text;

    return JSON.stringify({
        sender: result.text,
        response: "",
        // response: response,
        id: id
    });

}

export default transcript;