export interface Currency {
  alphabeticCode: string
  name: string
  numericCode: number
  minorUnit: number
  hasDestinationTagOrMemo: boolean
}

export interface AccountGroup {
  id: number
  name: string
  priority: number
  type: string
}

export interface AccountPlatform {
  id: number
  name: string
  caption: string
  type: string
  isDemo: boolean
  terminalUrl: string
}

export interface AccountStatement {
  availableBalance: string
  currentBalance: string
  credit: string
  equity: string
  freeMargin: string
  hold: string
  margin: string
  marginLevel: string
  pnl: string
  updateTime: string
}

export interface ProductGroup {
  id: number
  caption: string
  description: string
  type: string
  priority: number
  createTime: string
  updateTime: string
}

export interface ProductPlatform {
  id: number
  caption: string
  shortCaption: string
  name: string
  class: string
  isDemo: boolean
}

export interface Product {
  id: number
  type: string
  name: string
  caption: string
  group: ProductGroup
  platform: ProductPlatform
}

export interface ProductVariants {
  startAmounts: string[]
  leverages: string[]
}

export interface ProductCurrency {
  id: number
  caption: string
  product: Product
  currency: Currency
  factory: number
  variants: ProductVariants
  platformGroups: string[]
  isHedgingEnabled: boolean
  maxAccounts: number
  permissions: string[]
  priority: number
  linkInfo: string
  agreementLink: string
  minDepositAmount: string
}

export interface Account {
  accountId: number
  accountNumber: string
  displayNumber: string
  archive: boolean
  caption: string
  currency: Currency
  favourite: boolean
  group: AccountGroup
  platform: AccountPlatform
  priority: number
  statement: AccountStatement
  type: string
  createTime: string
  permissions: string[]
  productId: number
  rights: number
  leverage: number
  productCurrency: ProductCurrency
}
