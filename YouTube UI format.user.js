// ==UserScript==
// @name         YouTube UI format
// @namespace    http://tampermonkey.net/
// @version      2026-03-20
// @description  將直播中頻道另外整理出來，變更展示的數量3->5。
// @author       shio
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //--變更一排顯示數量--
    const TARGET_VAL = 5;
    const applyGridSetting = () => {
        const contents = document.getElementById('contents');
        if (contents) {
            contents.style.setProperty('--ytd-rich-grid-items-per-row', TARGET_VAL, 'important');
            contents.style.setProperty('--ytd-rich-grid-posts-per-row', TARGET_VAL, 'important');
            contents.style.setProperty('--ytd-rich-grid-slim-items-per-row', TARGET_VAL, 'important');
        }
    };
    const init = () => {
        const contents = document.getElementById('contents');
        if (contents) {
            applyGridSetting();
        } else {
            setTimeout(init, 500);
        }
    };

    //--直播中頻道拉出另外整理--
    let lastLiveCount = 0;
    let isProcessing = false;
    const sortLive = () => {
        if (isProcessing) return;
        const subLink = document.querySelector('a[href="/feed/subscriptions"]');
        if (!subLink) return;

        const subSection = subLink.closest('ytd-guide-section-renderer');
        const subList = subSection?.querySelector('#items');
        if (!subList) return;

        const allItems = Array.from(document.querySelectorAll('ytd-guide-entry-renderer'));
        const liveItems = allItems.filter(item => item.getAttribute('line-end-style') === 'badge');
        const currentLiveIds = liveItems.map(item => item.querySelector('a')?.href).join('|');

        if (window.lastLiveIds === currentLiveIds) return;
        window.lastLiveIds = currentLiveIds;
        isProcessing = true;

        window.requestAnimationFrame(() => {
            for (let i = liveItems.length - 1; i >= 0; i--) {
                const item = liveItems[i];
                if (subList.firstChild !== item) {
                    subList.insertBefore(item, subList.firstChild);
                }
            }
            isProcessing = false;
        });
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('#expander')) {
            setTimeout(sortLive, 300);
            setTimeout(sortLive, 800);
        }
    }, true);
    setInterval(sortLive, 3000);
    init();
    window.addEventListener('yt-navigate-finish', () => setTimeout(sortLive, 1000));
})();