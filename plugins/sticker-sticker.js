 killProcessOnBrowserClose: true, throwErrorOnTosBlock: false, chromiumArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache', '--disable-offline-load-stale-cache', '--disk-cache-size=0'], executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe', skipBrokenMethodsCheck: true, stickerServerEndpoint: true }}
let res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', { method: 'post', headers: { Accept: 'application/json, text/plain, /', 'Content-Type': 'application/json;charset=utf-8', }, body: JSON.stringify(Format)})
return Buffer.from((await res.text()).split(';base64,')[1], 'base64')}*/