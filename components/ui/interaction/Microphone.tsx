"use client";

import { Fragment, useState, useRef, useEffect, useActionState } from "react";
import { type SocialMediaManagerStore, socialMediaManagerStore } from '@/stores/useSocialMediaManagerStore';
import Link from "next/link";
// import {MediaRecorder, register} from 'extendable-media-recorder';
// import {connect} from 'extendable-media-recorder-wav-encoder';
// import { useSocialMediaManagerStore } from "@/providers/useSocialMediaManagerStoreProvider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPause, faStop, faPlay } from "@fortawesome/free-solid-svg-icons";

import transcript from "@/actions/transcript";
import '@fortawesome/fontawesome-svg-core/styles.css'

// import { RecordingState } from "@/components/types/RecordingState";
import type { RecordingState , MessageFormat } from "@/components/types/RecordingState";

declare global {
    interface Window {
        webkitSpeechRecognition: any
    }
}

const initialState = JSON.stringify({ sender: "John", response: "Hello", id: "123" });

// export const mimeType = "audio/wav";
const mimeType = 'audio/webm;codecs="opus"';

export default function MicroPhone(){

    const [state, formAction, isPending] = useActionState(transcript, initialState);
    // const {pending} = useFormStatus();
    // const recognitionRef = useRef<any>(null);
    const rfileRef = useRef<HTMLInputElement | null>(null);
    let mediaRecorder = useRef<MediaRecorder  | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const [active, setActive] = useState<boolean>(false);
    const [recordingState, setRecordingState] = useState<RecordingState>({
        recordingComplete: false,
        isRecording: false,
        stream: null,
        messages: [],
        pausedRecording: false,
        getPermission: false,
        audioChunks: []
    });

    useEffect(() => {
        const openAiResponse = JSON.parse(state);
        console.log({state_of_ActionState: openAiResponse});
        
        if(openAiResponse?.sender){
            const newmessage = {
                sender: openAiResponse.sender || "",
                response: openAiResponse.response || "",
                id: openAiResponse.id || "",
            };

            const messagesRecording = [...recordingState.messages, newmessage];

            socialMediaManagerStore.getState().setMessage(messagesRecording);

            setRecordingState(prevValues => ({
                ...prevValues,
                messages : messagesRecording
            }));
        }

    }, [state]);

    const uploadAudio = (blob: Blob) => {
        // const url = URL.createObjectURL(blob);
        console.log({audio_blob: blob});
        
        const file = new File([blob], 'audio.webm', {type: mimeType});

        // set the file as the value of the hidden file input field
        if(rfileRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            console.log({gotAudioFile: dataTransfer})

            rfileRef.current.files = dataTransfer.files;

            //simulate a click and submit the form
            if(submitButtonRef.current){
                submitButtonRef.current?.click();
            }
        }
    }

    const getMicroPhonePermission = async() => {
        // console.log(window);
        // if("mediaRecorder" in window){
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
                setRecordingState(prevValues => ({
                    ...prevValues,
                    getPermission: true,
                    stream: streamData
                }));
            } catch (err: any) {
                alert(err.message);
            }
        // } else {
        //     alert("The MediaRecorder API is not supported in your browser");
        // }
    }

    const startRecording = async () => {
        microPhoneHandler();

        const media = new MediaRecorder(recordingState.stream, {mimeType});           
        mediaRecorder.current = media;
        
        if(!recordingState.stream || mediaRecorder === null) return; // isPending || 
        console.log({"start recording": media, stream: recordingState.stream});


        setRecordingState(prevValues => ({
            ...prevValues,
            isRecording: prevValues.isRecording ? false : true,
            })
        );

        
        let localAudioChunk: Blob[] = [];
        mediaRecorder.current.start();
        mediaRecorder.current.ondataavailable = (event) => {
            if(typeof event.data === "undefined") return;
            if(event.data.size === 0) return;
            
            localAudioChunk.push(event.data);
        }

        setRecordingState(prevValue => ({
            ...prevValue,
            audioChunks: localAudioChunk
        }));

        console.log("sucess: start recordings");
    }

    useEffect(() => {
        getMicroPhonePermission();
    }, []);

    // const pausedRecording = () => {
    //     setRecordingState(prevValues => ({
    //         ...prevValues,
    //         pausedRecording: false,
    //         })
    //     );
    // }

    const stopRecording = async () => {
        
        if(mediaRecorder.current === null) return; // || isPending

        // if(recognitionRef.current) {
        //     recognitionRef.current.stop();
        // }
        // console.log({gotAudio: "audioBlob"});
        
        setActive(false);
        setRecordingState(prevValues => ({
            ...prevValues,
            isRecording: false,
            recordingComplete: true
            })
        );
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(recordingState.audioChunks, {type: mimeType});
            uploadAudio(audioBlob);
            setRecordingState(prevValues => ({
                ...prevValues,
                audioChunks: []
            }))
        }
        
        submitButtonRef.current?.click();

        console.log("stopped recording");
    }

    const microPhoneHandler = () => {
        setActive(true);
        // setActive(prevValue => (prevValue ? false : true));
    };

    console.log({messages: recordingState, storedMEssages: socialMediaManagerStore.getState()});

    const openAiMessages = recordingState.messages || null;

    // const messageHandler = (id) => {

    // }
    
    return (
        <form className="w-full" action={formAction}>
            {recordingState.messages.length > 0 &&
                <div className={`flex flex-col pt-5 space-y-4 ${recordingState.messages.length > 0 ? "pb-16" : "pb-8"}`}>
                    {openAiMessages?.map(message => (
                        <div key={message.id}>
                            <div className="pr-36">
                                <Link href={`/${message.id}`} >
                                    {/* onClick={() => messageHandler(message.id)} */}
                                    <p className="message transition duration-500 ease-in-out bg-gray-800 border-2 border-yellow-50 p-5 rounded-bl-none hover:border-4 hover:border-red-500  transform hover:-translate-y-1 hover:scale-110">{message.sender}</p>
                                </Link>
                            </div>
                            {/* <div className="pl-48">
                                <p>{message?.response}</p>
                            </div> */}
                        </div>
                    ))}

                </div>
            }
            {/* { recordingState.transscript && <p>{recordingState.transscript}</p>} */}
            <input type="file" name="audio" hidden ref={rfileRef}/>
            {/* <button hidden/> */}
            <section className="flex justify-center rounded-md text-center w-full bg-slate-50 mb-3">
                
                {(recordingState.isRecording || !recordingState.isRecording || recordingState.recordingComplete || !active) && (
                    <section className={`${!active ? 'hidden' : 'flex px-5 py-3 text-center'}`}>
                        {!active ? '' : !recordingState.isRecording ? <p className="text-red-400">Paused Recording </p> : <p className="text-red-400">Recording</p>}
                        {!active ? '' : recordingState.recordingComplete && <p className="text-red-400"> Recorded </p> }
                    </section>
                )} 
            </section>
            <section className="flex justify-between w-full">
                <button  disabled={!recordingState.isRecording ? false : true}>
                    <FontAwesomeIcon icon={faPlay} size="2x"/>
                </button>
                <Fragment>
                    {recordingState.getPermission && (
                        <button 
                            className={`rounded-full ${!recordingState.getPermission && 'bg-slate-500'} ${recordingState.getPermission && !recordingState.isRecording ? 'bg-blue-400' : 'bg-red-400'} p-5`} 
                            type="button" 
                            onClick={startRecording} 
                            disabled={!recordingState.getPermission && true}
                        >
                                {!recordingState.isRecording ? <FontAwesomeIcon icon={faMicrophone} size="2x" /> : <FontAwesomeIcon icon={faPause} size="2x" />}
                        </button>
                    )}                    
                    {!recordingState.getPermission && <button onClick={getMicroPhonePermission}>Get MicroPhone</button> }
                </Fragment>
                <button onClick={stopRecording} type="button"  >
                    <FontAwesomeIcon icon={faStop} size="2x"/>
                </button>
            </section>
        </form>
    )
}