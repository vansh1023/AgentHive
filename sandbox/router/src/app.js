import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware } from "http-proxy-middleware";
import http from 'http';

const app = express();
app.use(morgan('combined'));

app.use((req, res, next) => {
    console.log(`[ROUTER LOG] Incoming Request: ${req.method} ${req.url} on Host: ${req.headers.host}`);
    next();
});

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.get('/api/status/readyz', (req, res) => {
    res.status(200).json({ status: 'ready' });
})

const proxies = {}
const agentProxies = {}

function getProxy(sandboxId) {

    const target = `http://sandbox-service-${sandboxId}`; // Construct target URL based on sandboxId

    if (!proxies[ sandboxId ]) {
        proxies[ sandboxId ] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true,
            onError: (err, req, res) => {
                console.error(`[Proxy Error] Preview ${sandboxId}:`, err.message);
                // WebSocket errors ke case mein res object HTTP response nahi hota
                if (res && res.writeHead) {
                    res.writeHead(502, { 'Content-Type': 'text/plain' });
                    res.end('Proxy Error: Sandbox might be down or restarting.');
                }
            }
        })
    }
    return proxies[ sandboxId ];
}


function getAgentProxy(sandboxId) {

    const target = `http://sandbox-service-${sandboxId}:3000`; // Construct target URL based on sandboxId

    if (!agentProxies[ sandboxId ]) {
        agentProxies[ sandboxId ] = createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: true,
            onError: (err, req, res) => {
                console.error(`[Proxy Error] Agent ${sandboxId}:`, err.message);
                if (res && res.writeHead) {
                    res.writeHead(502, { 'Content-Type': 'text/plain' });
                    res.end('Proxy Error: Agent might be down or restarting.');
                }
            }
        })
    }

    return agentProxies[ sandboxId ];
}

app.use((req, res, next) => {
    const host = req.headers.host;
    const sandboxId = host.split('.')[ 0 ]; // Extract sandboxId from subdomain


    if (host.split('.')[ 1 ] === 'agent') {
        return getAgentProxy(sandboxId)(req, res, next);
    }

    else if (host.split('.')[ 1 ] === 'preview') {
        return getProxy(sandboxId)(req, res, next);
    }
    
})


const server = http.createServer(app);

// ✅ Handle WebSocket upgrades — this is what was missing
server.on('upgrade', (req, socket, head) => {
    const host = req.headers.host;
    const sandboxId = host.split('.')[ 0 ];
    const type = host.split('.')[ 1 ];

    console.log(`WS upgrade request: ${host}, sandboxId: ${sandboxId}, type: ${type}`);

    if (type === 'agent') {
        const proxy = getAgentProxy(sandboxId);
        proxy.upgrade(req, socket, head);
    } else if (type === 'preview') {
        const proxy = getProxy(sandboxId);
        proxy.upgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});

export default server;