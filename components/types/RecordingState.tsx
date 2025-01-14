
export type MessageFormat = {sender: string, response: string, id: string}

export type RecordingState = {
    recordingComplete: boolean,
    isRecording: boolean,
    pausedRecording: boolean,
    stream: any,
    messages: MessageFormat[],
    getPermission: boolean,
    audioChunks: Blob[] | []
}