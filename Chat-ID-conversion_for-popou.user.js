// ==UserScript==
// @name         Chat-ID-conversion for popou
// @namespace    http://tampermonkey.net/
// @version      2025-11-14
// @description  ID conversion
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
    console.log('[YT Chat] Script Loaded ✅');

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
            //if (authorEl) authorEl.textContent = `${users[authorHandle]}`;
            if (authorEl) {
                authorEl.textContent = '';
                const a = document.createElement('a');
                a.title = `${users[authorHandle].info1}位訂閱者 ${users[authorHandle].info2}部影片`;
                a.textContent = users[authorHandle].title;
                authorEl.appendChild(a);
            };
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
                    const match2 = html.match(/>([\d,.]+(?:萬)?)\s*位訂閱者.*?([\d,]+)\s*部影片/);
                    const info1 = match2 ? match2[1] : '0';
                    const info2 = match2 ? match2[2] : '0';
                    //users[authorHandle] = title;
                    users[authorHandle] = {};
                    users[authorHandle].title = title;
                    users[authorHandle].info1 = info1.replace(/,/g, '');
                    users[authorHandle].info2 = info2.replace(/,/g, '');
                    //if (authorEl) authorEl.textContent = `${title}`;
                    users[authorHandle].info2 = info2.replace(/,/g, '');
                    if (authorEl) {
                        authorEl.textContent = '';
                        const a = document.createElement('a');
                        a.title = `${info1}位訂閱者 ${info2}部影片`;
                        a.textContent = title;
                        authorEl.appendChild(a);
                    };
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
            console.warn('[YT Chat] ⚠️ Failed to find chat container after multiple attempts');
        }
    }, 5000);
})();
