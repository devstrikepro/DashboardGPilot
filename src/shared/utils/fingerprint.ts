/**
 * Utility for generating device fingerprint and signing as JWT
 */

export interface FingerprintData {
  user_agent: string;
  systemLang: string;
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
    return {
      user_agent: navigator.userAgent,
      systemLang: navigator.language || (navigator as any).userLanguage || "en-US",
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
  async signPayload(data: FingerprintData, _secret: string = ""): Promise<string> {
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);
    return btoa(String.fromCharCode(...Array.from(bytes)));
  },
};

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
