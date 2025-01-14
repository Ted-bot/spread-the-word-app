// import {type params as MessageParams} from "@/components/ui/interaction/DetailedMessage";
import DetailedMessage from "@/components/ui/interaction/DetailedMessage";
import MicroPhone from "@/components/ui/interaction/Microphone";
// import type params

export default async function BlogPage({params,} : {
    params: Promise<{slug: string}>,

    // type params = Promise<{slug: string}>;
}) {
    // const {slug} = await params;
    return (<main>
        <h1>The Blog</h1>
        <DetailedMessage params={params}/>
    </main>)
}

