/**
 * Utility for generating device fingerprint and signing as JWT
 */

export interface FingerprintData {
    canvasCode: string;
    systemLang: string;
    userAgent: string;
    timezoneOffset: number;
    webTimezone: string;
    webglVendor: string;
    webglRenderer: string;
}

export const FingerprintUtils = {
    /**
     * Collects device information for fingerprinting
     */
    collect: (): FingerprintData => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let canvasCode = '';
        
        if (ctx) {
            // Standard FingerprintJS size (240x140)
            canvas.width = 240;
            canvas.height = 140;
            
            // 1. Text & Background
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("hello, world", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("hello, world", 4, 17);

            // 2. Overlapping Circles (Pattern used in many fingerprinting libs)
            ctx.globalCompositeOperation = "multiply";
            ctx.fillStyle = "rgb(255,0,255)";
            ctx.beginPath();
            ctx.arc(50, 50, 40, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = "rgb(0,255,255)";
            ctx.beginPath();
            ctx.arc(100, 50, 40, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = "rgb(255,255,0)";
            ctx.beginPath();
            ctx.arc(75, 100, 40, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();

            canvasCode = canvas.toDataURL();
        }

        

        return {
            canvasCode,
            systemLang: (navigator.language || (navigator as any).userLanguage || 'en-US'),
            userAgent: navigator.userAgent,
            timezoneOffset: new Date().getTimezoneOffset(),
            webTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            webglVendor: getWebGLVendor(),
            webglRenderer: getWebGLRenderer(),
        };
    },

    /**
     * Generates a JWT string where data is in the Header and Payload is empty
     * Based on user feedback for "Unsecured JWT" format
     */
    async signPayload(data: FingerprintData, _secret: string = ''): Promise<string> {
        const header = {
            ...data
        };
        
        const payload = {};

        const base64UrlEncode = (obj: any) => {
            const json = JSON.stringify(obj);
            // Use TextEncoder for UTF-8
            const bytes = new TextEncoder().encode(json);
            const base64 = btoa(String.fromCharCode(...Array.from(bytes)));
            return base64
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        };

        const encodedHeader = base64UrlEncode(header);
        const encodedPayload = base64UrlEncode(payload);

        // Standard Unsecured JWT: header.payload.
        return `${encodedHeader}.${encodedPayload}.`;
    }
};

function getWebGLVendor(): string {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'unknown';
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
    } catch (e) {
        return 'unknown';
    }
}

function getWebGLRenderer(): string {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'unknown';
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    } catch (e) {
        return 'unknown';
    }
}

