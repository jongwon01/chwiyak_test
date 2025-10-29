// /backend/src/config/db.js (전체 교체)

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { Client } from 'ssh2';
import net from 'net';

dotenv.config();

const createTunneledPool = () => {
    return new Promise((resolve, reject) => {
        const sshClient = new Client();

        const sshConfig = {
            host: process.env.SSH_HOST,
            port: parseInt(process.env.SSH_PORT || '22', 10),
            username: process.env.SSH_USER,
            password: process.env.SSH_PASSWORD
        };

        const dbServer = {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
        };
        
        // 내 컴퓨터(WAS)에서 사용할 임시 로컬 포트
        const localPort = 3307; 

        sshClient.on('ready', () => {
            console.log('✅ SSH Tunnel is established.');
            
            // 로컬 TCP 서버 생성
            const server = net.createServer(socket => {
                // 로컬 서버에 연결이 들어오면, SSH 터널을 통해 DB 서버로 전달(포워딩)
                sshClient.forwardOut('127.0.0.1', 0, dbServer.host, dbServer.port, (err, stream) => {
                    if (err) {
                        console.error('❌ DB Forwarding Error:', err);
                        return sshClient.end();
                    }
                    socket.pipe(stream).pipe(socket);
                });
            });

            server.listen(localPort, '127.0.0.1', () => {
                console.log(`✅ Local TCP server listening on port ${localPort}`);

                // DB 연결 설정: 이제 DB가 내 컴퓨터에 있는 것처럼 로컬 포트로 접속
                const dbConfig = {
                    host: '127.0.0.1',
                    port: localPort,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0
                };

                const pool = mysql.createPool(dbConfig);
                console.log('✅ DB Connection Pool is created.');
                resolve(pool);
            });

            server.on('error', reject);

        }).on('error', (err) => {
            console.error('❌ SSH Client Error:', err);
            reject(err);
        }).connect(sshConfig);
    });
};

const pool = await createTunneledPool();

export default pool;