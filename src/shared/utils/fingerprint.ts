/**
 * Utility for generating device fingerprint in B2Broker expected format.
 * Output: base64(JSON) — matching the deviceFingerprint field format.
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
  collect: (): FingerprintData => {
    return {
      canvasCode: getCanvasCode(),
      systemLang: navigator.language || (navigator as any).userLanguage || "en-US",
      userAgent: navigator.userAgent,
      timezoneOffset: new Date().getTimezoneOffset(),
      webTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      webglVendor: getWebGLVendor(),
      webglRenderer: getWebGLRenderer(),
    };
  },

  async signPayload(data: FingerprintData, _secret: string = ""): Promise<string> {
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },
};

function getCanvasCode(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.font = "14px 'Arial'";
    ctx.fillText("Hello, world! 🌍", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Hello, world! 🌍", 4, 17);
    return canvas.toDataURL();
  } catch {
    return "";
  }
}

function getWebGLVendor(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "unknown";
    const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    return debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "unknown";
  } catch (e) {
    return "unknown";
  }
}

function getWebGLRenderer(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "unknown";
    const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    return debugInfo ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown";
  } catch (e) {
    return "unknown";
  }
}
