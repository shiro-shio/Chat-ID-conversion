// ==UserScript==
// @name         Chat-ID-conversion for popou
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  try to take over the world!
// @author       shio
// @match        https://www.youtube.com/live_chat?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @connect      youtube.com
// @run-at       document-end
// @noframes     false
// ==/UserScript==

(function() {
    'use strict';
    const VALID_TAGS = [
        'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-MEMBER-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-PAID-STICKER-RENDERER',
        'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER',
        'YTD-SPONSORSHIPS-LIVE-CHAT-GIFT-PURCHASE-ANNOUNCEMENT-RENDERER'
    ];

    function initYTLiveChatObserver() {
        const items = document.querySelector('yt-live-chat-item-list-renderer #items');
        console.log(items);
        if (!items) return false;
        
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        VALID_TAGS.includes(node.tagName)) {
                        const authorEl = node.querySelector('#author-name');
                        const author = authorEl?.textContent?.trim() || '???';
                        if (author.startsWith('@')) {
                            fetchAuthorPage(author, authorEl);
                        }
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
            return;
        }
        const url = `https://www.youtube.com/${authorHandle}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: res => {
                if (res.status === 200) {
                    const html = res.responseText;
                    const match = html.match(/<meta property="og:title" content="([^"]+)"/);
                    const title = match ? match[1] : 'Unknown';
                    //console.log(`[YT Author] ${authorHandle} 頻道標題:`, title);
                    users[authorHandle] = title;
                    if (authorEl) authorEl.textContent = `${title}`;
                } else {
                    console.warn('[YT Author] 取得失敗', res.status);
                }
            },
            onerror: err => console.error('[YT Author] 請求錯誤', err)
        });
    }

    let attempt = 0;
    const watcher = setInterval(() => {
        console.log(attempt);
        if (initYTLiveChatObserver()) {
            clearInterval(watcher);
        } else if (++attempt > 30) {
            clearInterval(watcher);
            console.warn('[YT Chat] Failed);
        }
    }, 5000);
})();
