"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whitelist = ['127.0.0.1', '192.168.1.1'];
function simulateMiddleware(clientIp) {
    console.log(`Testing IP: ${clientIp}`);
    const isWhitelisted = whitelist.some((ip) => ip.trim() === clientIp);
    if (isWhitelisted) {
        console.log("✅ ACCESS GRANTED");
        return true;
    }
    else {
        console.log(`❌ ACCESS BLOCKED (Forbidden)`);
        return false;
    }
}
simulateMiddleware('127.0.0.1');
simulateMiddleware('8.8.8.8');
simulateMiddleware('192.168.1.1');
//# sourceMappingURL=test-ip-logic.js.map