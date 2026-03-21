# Chat-ID-conversion
 彈窗用**for-popou**

## 可協助聊天室將@ID變更回名字


這是tampermonkey腳本

需安裝chrome的擴充tampermonkey[篡改猴](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

需要在擴充功能上 **允許使用者指令碼**

<img width="659" height="69" alt="image" src="https://github.com/user-attachments/assets/3c06c41b-aeed-4627-bbda-45a98e7dfc01" />

在tampermonkey上選擇新增腳本

<img width="237" height="123" alt="image" src="https://github.com/user-attachments/assets/98735ba0-2593-4b3c-a2c6-7933421c468b" />

貼上JS保存即可用


## 操作流程

1.安裝擴充tampermonkey

2.到chrome管理擴充選**篡改猴**詳細資料**允許使用者指令碼***

3.到yt點一下篡改猴圖示開啟

<img width="81" height="38" alt="image" src="https://github.com/user-attachments/assets/a1825da4-3008-4c09-b7b0-619636aa6293" />

4.允許存取yt

<img width="362" height="134" alt="image" src="https://github.com/user-attachments/assets/5d3f6e49-d279-4662-8d19-f8b054db0123" />

5.新增腳本直接複製我的腳本直接覆蓋全部

6.去任意直播間確認

<img width="254" height="296" alt="image" src="https://github.com/user-attachments/assets/6e4f5646-0f9d-4bf4-b1a8-4dad2f2ceed4" />


# 1. 權限範圍說明 (Permissions)
- 網域限制 (@match)：腳本僅在 youtube.com/watch (影片) 與 youtube.com/live (直播) 網域下啟動。它完全無法讀取或干涉您在其他網站（如銀行、社群媒體）的任何資料。

- 跨域請求 (@connect)：獲准向 youtube.com 發送背景請求。這僅用於獲取必要的 ID 轉換資訊，確保功能的完整性。

- 框架執行 (@noframes: false)：允許腳本在 YouTube 頁面內的 iframe（例如右側的直播聊天室窗格）中執行。這是為了能即時處理聊天室內的 ID 資訊，否則轉換功能將無法在聊天室生效。

# 2. 資料處理與隱私
- 無惡意更新：本腳本不具備自動更新功能。除非您手動替換程式碼，否則腳本內容不會被遠端修改，避開了自動更新可能帶來的惡意程式碼植入風險。

- 資料傳輸：僅**蒐集ID對應的名字**，降低對youtube的資料請求。**(不會蒐集其他無關資料)**

# 3. 使用風險提示
- YouTube 條款相關：任何修改網頁 UI 或自動化操作的工具，理論上都可能違反 YouTube 的服務條款。雖然本腳本屬於輕量級輔助工具，遭封鎖機率極低，但仍請使用者自行承擔帳號受限的潛在風險。

- 原始碼透明：本腳本不包含任何經過混淆（Obfuscated）的程式碼。您可以隨時透過 Tampermonkey 編輯器查看完整的 JavaScript 原始碼，確保功能如所述般單純。

- 環境隔離建議：若您對安全性有極高要求，建議在 Chrome 的「訪客模式」或「專屬測試設定檔」中執行本腳本。
