import { useEffect } from 'react';

const LiveChat = () => {
    useEffect(() => {
        // Tawk.to Script
        // User provided IDs
        const PROPERTY_ID = '6956784e562358197db4764f';
        const WIDGET_ID = '1jdssbsu1';

        var Tawk_API = window.Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();

        // Expose open function for Terminal
        window.openLiveChat = () => {
            if (window.Tawk_API && window.Tawk_API.maximize) {
                window.Tawk_API.maximize();
            } else {
                console.log("Chat widget loading...");
            }
        };

    }, []);

    return null;
};

export default LiveChat;
