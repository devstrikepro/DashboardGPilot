/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // ซ่อน Backend URL ผ่าน Next.js Gateway Proxy
    // เช่น ยิง /api/gateway/api/v1/trades จะถูกส่งไปที่ API จริงในเบื้องหลัง
    return [
      {
        source: '/api/gateway/:path*',
        // เปลี่ยน NEXT_PUBLIC_API_URL (ถ้ามี) หรือใช้ค่าจากที่มีอยู่ สำหรับ dev ปกติใช้ localhost:8000 หรืออื่นๆ
        destination: `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`, 
      },
    ];
  },
}

export default nextConfig
