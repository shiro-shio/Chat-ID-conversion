// ==UserScript==
// @name         Chat-ID conversion
// @namespace    http://tampermonkey.net/
// @version      2025-11-08
// @description  ID conversion
// @author       shio
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @connect      youtube.com
// @run-at       document-end
// @noframes     false
// ==/UserScript==


(function() {
    'use strict';
    setTimeout(() => alert('[提醒通知] 您正在使用\n"Chat-ID conversion"\n按下確定繼續'), 3000);
    console.log('[YT Chat Reader] 啟動中...');
    // 等待 iframe 內部 document 可讀
    function waitForIframe() {
        const iframe = document.querySelector("ytd-app #content iframe");
        if (iframe && iframe.contentDocument) {
            console.log('[YT Chat Reader] 找到聊天室');
            waitForChatContainer(iframe.contentDocument);
        } else {
            setTimeout(waitForIframe, 1000);
        }
    }

    // 等待聊天室容器 #items 出現
    function waitForChatContainer(doc) {
        const items = doc.querySelector('yt-live-chat-item-list-renderer #items');
        if (items) {
            console.log('[YT Chat Reader] 找到聊天室容器');
            observeChat(items);
        } else {
            console.log('[YT Chat Reader] 等待聊天室容器...');
            setTimeout(() => waitForChatContainer(doc), 3000);
        }
    }
    const VALID_TAGS = [
        'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-MEMBER-MESSAGE-RENDERER',
        'YT-LIVE-CHAT-PAID-STICKER-RENDERER',
        'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER'
    ];
    // 監聽新訊息
    function observeChat(items) {
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
        console.log('[YT Chat Reader] 監聽聊天室訊息');
    }
    let users = {};
    function fetchAuthorPage(authorHandle, authorEl) {
        if (authorHandle in users){
            if (authorEl) authorEl.textContent = `${users[authorHandle]}`;
            return;
        }
        const url = `https://www.youtube.com/${authorHandle}`; // 保留 @
        //console.log('[YT Author] 取得 URL:', url);
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
    waitForIframe();
})();
