import React, {useEffect, useRef, useState} from "react";

export default function IframeGoogleDoc({url, className, loading, stopLoading}) {

    const [iframeTimeoutId, setIframeTimeoutId] = useState(undefined);
    const iframeRef = useRef(null);

    useEffect(()=>{
        const intervalId = setInterval(
            updateIframeSrc, 1000 * 3
        );
        setIframeTimeoutId(intervalId)
    },[]);

    function iframeLoaded() {
        stopLoading(false)
        clearInterval(iframeTimeoutId);
    }
    function getIframeLink() {
        return `https://docs.google.com/gview?url=${url}&embedded=true`;
    }
    function updateIframeSrc() {
        if(iframeRef.current){
            iframeRef.current.src = getIframeLink();
        }
    }

    return (
        <iframe
            className={className}
            onLoad={iframeLoaded}
            onError={updateIframeSrc}
            ref={iframeRef}
            src={getIframeLink()}
            width="100%" 
            height={!loading ? "600" : "0"}
            frameBorder="0"
        />
    );
}