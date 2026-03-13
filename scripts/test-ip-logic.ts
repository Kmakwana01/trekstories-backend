
const whitelist = ['127.0.0.1', '192.168.1.1'];

function simulateMiddleware(clientIp: string) {
    console.log(`Testing IP: ${clientIp}`);
    const isWhitelisted = whitelist.some((ip) => ip.trim() === clientIp);

    if (isWhitelisted)
    {
        console.log("✅ ACCESS GRANTED");
        return true;
    } else
    {
        console.log(`❌ ACCESS BLOCKED (Forbidden)`);
        return false;
    }
}

// Test cases
simulateMiddleware('127.0.0.1'); // Should be allowed
simulateMiddleware('8.8.8.8');   // Should be blocked
simulateMiddleware('192.168.1.1'); // Should be allowed
