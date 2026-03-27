export interface AccountInfo {
  readonly login: number;
  readonly server: string;
  readonly name: string;
  readonly currency: string;
  readonly balance: number;
  readonly equity: number;
  readonly margin: number;
  readonly margin_free: number;
  readonly margin_level: number;
  readonly leverage: number;
  readonly profit: number;
}
