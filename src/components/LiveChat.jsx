import { useEffect } from 'react';

const LiveChat = () => {
    useEffect(() => {
        // Tawk.to Script
        // Replace 'YOUR_PROPERTY_ID' with your actual ID from dashboard.tawk.to
        // You can find this in Administration -> Widget Code

        // Example ID placeholder:
        const PROPERTY_ID = 'YOUR_PROPERTY_ID';
        const WIDGET_ID = 'default';

        if (PROPERTY_ID === 'YOUR_PROPERTY_ID') {
            console.warn("LiveChat: Please update components/LiveChat.jsx with your Tawk.to Property ID.");
            return;
        }

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
