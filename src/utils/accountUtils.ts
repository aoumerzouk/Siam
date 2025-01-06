export const generateAccountNumber = (
  baseNumber: string,
  typeCode: string,
  suffix: string
): string => {
  // Ensure each part is padded correctly
  const paddedBase = baseNumber.padStart(7, '0');
  const paddedType = typeCode.padStart(3, '0');
  const paddedSuffix = suffix.padStart(3, '0');
  
  return `${paddedBase}${paddedType}${paddedSuffix}`;
};

export const parseAccountNumber = (fullAccountNumber: string) => {
  if (fullAccountNumber.length !== 13) {
    throw new Error('Invalid account number length');
  }

  return {
    base: fullAccountNumber.slice(0, 7),
    typeCode: fullAccountNumber.slice(7, 10),
    suffix: fullAccountNumber.slice(10)
  };
};

export const ACCOUNT_TYPE_CODES = {
  share: '001',
  draft: '002',
  certificate: '003',
  moneyMarket: '004',
  loan: '005',
  lineOfCredit: '006'
};