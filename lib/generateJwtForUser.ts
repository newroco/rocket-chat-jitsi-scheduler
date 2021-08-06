import { Utf8 } from './crypto-js/core';
import { Base64 } from './crypto-js/enc-base64';
import { HmacSHA256 } from './crypto-js/sha256';

export async function generateJwtForUser(user) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const stringifiedHeader = Utf8.parse(JSON.stringify(header));

    const encodedHeader = base64url(stringifiedHeader);
    const data = {
        context: {
            user: {
                // avatar: user.avatarUrl,
                name: user.name,
                email: user.emails[0].address,
            },
        },
        moderator: true,
        aud: 'jitsi',
        iss: 'RocketChatNewroco',
        sub: 'meet.newro.co',
        room: '*',
        exp: 1802200000,
    };

    const stringifiedData = Utf8.parse(JSON.stringify(data));

    const encodedData = base64url(stringifiedData);

    const token = encodedHeader + '.' + encodedData;
    const secret = 'RHmpoaEkINe4dclcpOpraN5rI3GlDcuKTYsIRozA';

    const signature = HmacSHA256(token, secret);

    return token + '.' + base64url(signature);
}

function base64url(source) {
    // Encode in classical base64
    let encodedSource = Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}
