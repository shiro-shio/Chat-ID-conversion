// ==UserScript==
// @name         Chat-ID-conversion V2 for popou
// @namespace    http://tampermonkey.net/
// @version      2026-03-20
// @description  ID conversion
// @author       shio
// @match        https://www.youtube.com/live_chat?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @connect      youtube.com
// @run-at       document-end
// @noframes     false
// ==/UserScript==

(function() {
    'use strict';
    console.log('[YT Chat] Script Loaded ✅');

    const VALID_TAGS = [
        'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-MEMBER-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-PAID-STICKER-RENDERER',
        'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER',
        'YTD-SPONSORSHIPS-LIVE-CHAT-GIFT-PURCHASE-ANNOUNCEMENT-RENDERER',
        'YTD-SPONSORSHIPS-LIVE-CHAT-GIFT-REDEMPTION-ANNOUNCEMENT-RENDERER',
        'YT-GIFT-MESSAGE-VIEW-MODEL'
    ];

    function initYTLiveChatObserver() {
        const items = document.querySelector('yt-live-chat-item-list-renderer #items');

        if (!items) return false;
        console.log('[YT Chat] ✅ Chat container found');

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        VALID_TAGS.includes(node.tagName)) {
                        const authorEl = node.querySelector('#author-name');
                        //const messageEl = node.querySelector('#message');
                        const author = authorEl?.textContent?.trim() || '???';
                        //const message = messageEl?.textContent?.trim() || '';
                        //authorEl.textContent = `[Test] ${author}`;
                        if (author.startsWith('@')) {
                            fetchAuthorPage(author, authorEl);
                        }
                        //console.log(`[Chat] ${author}: ${message}`);
                    }
                }
            }
        });

        observer.observe(items, { childList: true });
        return true;
    }
    let users = {};
    function fetchAuthorPage(authorHandle, authorEl) {
        if (authorHandle in users){
            if (authorEl) authorEl.textContent = `${users[authorHandle]}`;
            /*if (authorEl) {
                authorEl.textContent = '';
                const a = document.createElement('a');
                a.title = `${users[authorHandle].info1}位訂閱者 ${users[authorHandle].info2}部影片`;
                a.textContent = users[authorHandle].title;
                authorEl.appendChild(a);
            };*/
            return;
        }
        const url = `https://yt-id-conversion.shiroshio0507.workers.dev/?chid=${authorHandle}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
            if (data.status === "success") {
                users[authorHandle] = data.name;
                if (authorEl) authorEl.textContent = `${data.name}`;
            } else {
                if (authorEl) authorEl.textContent = `${authorHandle}`;
            }
        })
            .catch(err => console.error("請求失敗:", err));
    }

    let attempt = 0;
    const watcher = setInterval(() => {
        console.log(attempt);
        if (initYTLiveChatObserver()) {
            clearInterval(watcher);
        } else if (++attempt > 30) {
            clearInterval(watcher);
            console.warn('[YT Chat] ⚠️ Failed to find chat container after multiple attempts');
        }
    }, 5000);
})();
