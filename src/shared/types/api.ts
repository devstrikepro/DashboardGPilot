// ---------------------------------------------
// Core Service Types (Global Rules #10)
// ---------------------------------------------

/**
 * โครงสร้าง Error กรณี Validation Fail (422)
 * ที่จะปรากฏในฟิลด์ error
 */
export interface ValidationErrorDetail {
  readonly loc: readonly (string | number)[];
  readonly msg: string;
  readonly type: string;
}

/**
 * มาตรฐานการตอบกลับจาก Backend
 * @template T ประเภทของข้อมูลที่อยู่ในฟิลด์ data
 */
export interface ServiceResponse<T> {
  readonly success: boolean;    // บอกว่าการทำงานสำเร็จหรือไม่
  readonly data: T | null;      // ข้อมูล Payload (จะเป็น null หาก success เป็น false)
  readonly error: string | readonly ValidationErrorDetail[] | null; // รายละเอียดข้อผิดพลาด
}

// ---------------------------------------------
// Re-export Domain Models
// ---------------------------------------------
export * from './domain';
