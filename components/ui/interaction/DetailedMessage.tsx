"use client";

import { useState, useEffect } from 'react';
import { socialMediaManagerStore } from '@/stores/useSocialMediaManagerStore';
import type { MessageFormat } from '@/components/types/RecordingState';

export type params = { params: {value: string}};

export default function DetailedMessage(params: params){

    console.log({detail_id: params});

    const [ detailMessage,setDetailMessage] = useState(""); 
    useEffect(() => {
        const stringData = socialMediaManagerStore.getState().messages;
        const messages = stringData.find((test: MessageFormat) => (test.id === JSON.parse(params.params.value).slug));

       messages && setDetailMessage(messages.sender);
    }, [params])
    localStorage.getItem('position-storage');

    return(<>
        <div>
        {detailMessage || "..."}
        </div>
    </>)
}