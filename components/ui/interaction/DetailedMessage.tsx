"use client";

import { useState, useEffect } from 'react';
import { socialMediaManagerStore } from '@/stores/useSocialMediaManagerStore';
import type { MessageFormat } from '@/components/types/RecordingState';

// type params = Promise<{slug: string}>;

export default async function DetailedMessage({params,} : {
    params: Promise<{slug: string}>
    // type params = Promise<{slug: string}>;
}) {
    console.log({detail_id: params});
    const {slug} = await params;

    const [ detailMessage,setDetailMessage] = useState(""); 
    useEffect(() => {
        const stringData = socialMediaManagerStore.getState().messages;
        const messages = stringData.find(async(test: MessageFormat) => (test.id === JSON.parse(slug)));

       messages && setDetailMessage(messages.sender);
    }, [slug])
    localStorage.getItem('position-storage');

    return(<>
        <div>
        {detailMessage || "..."}
        </div>
    </>)
}

// export {params};