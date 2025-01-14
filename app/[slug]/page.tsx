import DetailedMessage, { type params as messageParams} from "@/components/ui/interaction/DetailedMessage";
import MicroPhone from "@/components/ui/interaction/Microphone";
// import type params

export default function BlogPage(params: messageParams){

    
    return <main>
        <h1>The Blog</h1>
        <DetailedMessage {...params}/>
    </main>
}