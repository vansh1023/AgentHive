import app, { getProxy, getAgentProxy } from "./src/app.js";


// const server = app.listen(3000, '0.0.0.0', () => {
//     console.log('Sandbox router server is running on port 3000');
// });

const server = app.listen(3000, () => {
    console.log('Sandbox router server is running on port 3000');
});


// server.on('upgrade', (req, socket, head) => {
//     const host = req.headers.host;
//     if (!host) {
//         socket.destroy();
//         return;
//     }

//     const sandboxId = host.split('.')[0];

//     try {
//         if (host.split('.')[1] === 'agent') {
//             const proxy = getAgentProxy(sandboxId);
//             if(proxy) proxy.upgrade(req, socket, head);
//         } else if (host.split('.')[1] === 'preview') {
//             const proxy = getProxy(sandboxId);
//             if(proxy) proxy.upgrade(req, socket, head);
//         } else {
//             socket.destroy();
//         }
//     } catch(err) {
//         console.error("Upgrade error:", err);
//         socket.destroy();
//     }
// });


server.on('upgrade', (req, socket, head) => {
    const host = req.headers.host;
    if (!host) {
        socket.destroy();
        return;
    }

    const sandboxId = host.split('.')[0];

    if (host.split('.')[1] === 'agent') {
        const proxy = getAgentProxy(sandboxId);
        proxy.upgrade(req, socket, head);
    } else if (host.split('.')[1] === 'preview') {
        const proxy = getProxy(sandboxId);
        proxy.upgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});