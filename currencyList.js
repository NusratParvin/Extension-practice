const luluCurrencies = [
  { code: "INR", country: "INDIAN RUPEE" },
  { code: "PKR", country: "PAKISTANI RUPEE" },
  { code: "BDT", country: "BANGLADESHI TAKA" },
  { code: "PHP", country: "PHILIPPINE PESO" },
  { code: "EGP", country: "EGYPTIAN POUND" },
  { code: "KES", country: "KENYAN SHILLING" },
  { code: "MAD", country: "MOROCCAN DIRHAM" },
  { code: "MUR", country: "MAURITIUS RUPEE" },
  { code: "CHF", country: "SWISS FRANC" },
  { code: "VND", country: "VIETNAMESE DONG" },
  { code: "BRL", country: "BRAZILIAN REAL" },
  { code: "OMR", country: "OMANI RIYAL" },
  { code: "RUB", country: "RUSSIAN FEDERATION ROUBLE" },
  { code: "NZD", country: "NEW ZEALAND DOLLAR" },
  { code: "SEK", country: "SWEDISH KRONA" },
  { code: "AZN", country: "AZERBAIJAN MANAT(AZN)" },
  { code: "AUD", country: "AUSTRALIAN DOLLAR" },
  { code: "RSD", country: "SERBIAN DINAR" },
  { code: "BAM", country: "CONVERTIBLE MARK" },
  { code: "IDR", country: "INDONESIA RUPIAH" },
  { code: "SCP", country: "SCOTLAND POUND" },
  { code: "UGX", country: "UGANDA SHILLING" },
  { code: "GBP", country: "BRITISH POUND" },
  { code: "JPY", country: "JAPANESE YEN" },
  { code: "NOK", country: "NORWEGIAN KRONE" },
  { code: "CAD", country: "CANADIAN DOLLAR" },
  { code: "USD", country: "US DOLLAR" },
  { code: "EUR", country: "EURO" },
  { code: "SAR", country: "SAUDI RIYAL" },
  { code: "ZAR", country: "SOUTH AFRICAN RAND" },
  { code: "LBP", country: "LEBANESE POUND" },
  { code: "IEP", country: "IRISH POUND" },
  { code: "TZS", country: "TANZANIAN SHILLING" },
  { code: "NGN", country: "NAIRA" },
  { code: "PLN", country: "POLISH ZLOTY" },
  { code: "KWD", country: "KUWAITI DINAR" },
  { code: "CNY", country: "CHINESE RENMINBI YUAN" },
  { code: "GEL", country: "GEORGIAN LARI" },
  { code: "CZK", country: "CZECH KORUNA" },
  { code: "NPR", country: "NEPALESE RUPEE" },
  { code: "LKR", country: "SRI LANKAN RUPEE" },
  { code: "MYR", country: "MALAYSIAN RINGGIT" },
  { code: "DKK", country: "DANISH KRONE" },
  { code: "SCR", country: "SEYCHELLES RUPEE" },
  { code: "BHD", country: "BAHRAINI DINAR" },
  { code: "GHS", country: "GHANAIAN CEDI" },
  { code: "BND", country: "BRUNEI DOLLAR" },
  { code: "TND", country: "TUNISIAN DINAR" },
  { code: "KRW", country: "SOUTH KOREAN WON" },
  { code: "SGD", country: "SINGAPORE DOLLAR" },
  { code: "TWD", country: "TAIWAN DOLLAR" },
  { code: "HKD", country: "HONG KONG DOLLAR" },
  { code: "JOD", country: "JORDANIAN DINAR" },
  { code: "IQD", country: "IRAQI DINAR" },
  { code: "TRL", country: "TURKISH LIRA" },
  { code: "QAR", country: "QATARI RIYAL" },
  { code: "THB", country: "THAILAND BAHT" },
];

const fardanCurrencies = [
  { code: "AUD", country: "AUSTRALIAN DOLLAR" },
  { code: "BDT", country: "BANGLADESHI TAKA" },
  { code: "BHD", country: "BAHRAINI DINAR" },
  { code: "CAD", country: "CANADIAN DOLLAR" },
  { code: "CHF", country: "SWISS FRANC" },
  { code: "CNY", country: "CHINESE RENMINBI YUAN" },
  { code: "CYP", country: "CYPRIOT POUND" },
  { code: "DKK", country: "DANISH KRONE" },
  { code: "EGP", country: "EGYPTIAN POUND" },
  { code: "EUR", country: "EURO" },
  { code: "GBP", country: "BRITISH POUND" },
  { code: "HKD", country: "HONG KONG DOLLAR" },
  { code: "IDR", country: "INDONESIA RUPIAH" },
  { code: "INR", country: "INDIAN RUPEE" },
  { code: "JOD", country: "JORDANIAN DINAR" },
  { code: "JPY", country: "JAPANESE YEN" },
  { code: "KWD", country: "KUWAITI DINAR" },
  { code: "LBP", country: "LEBANESE POUND" },
  { code: "LKR", country: "SRI LANKAN RUPEE" },
  { code: "MAD", country: "MOROCCAN DIRHAM" },
  { code: "MYR", country: "MALAYSIAN RINGGIT" },
  { code: "NOK", country: "NORWEGIAN KRONE" },
  { code: "NPR", country: "NEPALESE RUPEE" },
  { code: "NZD", country: "NEW ZEALAND DOLLAR" },
  { code: "OMR", country: "OMANI RIYAL" },
  { code: "PHP", country: "PHILIPPINE PESO" },
  { code: "PKR", country: "PAKISTANI RUPEE" },
  { code: "QAR", country: "QATARI RIYAL" },
  { code: "SAR", country: "SAUDI RIYAL" },
  { code: "SEK", country: "SWEDISH KRONA" },
  { code: "SGD", country: "SINGAPORE DOLLAR" },
  { code: "SYP", country: "SYRIAN POUND" },
  { code: "THB", country: "THAILAND BAHT" },
  { code: "TND", country: "TUNISIAN DINAR" },
  { code: "TRY", country: "TURKISH LIRA" },
  { code: "USD", country: "US DOLLAR" },
  { code: "YER", country: "YEMENI RIAL" },
  { code: "ZAR", country: "SOUTH AFRICAN RAND" },
];

const ansariCurrencies = [
  { code: "INR", country: "INDIAN RUPEE" },
  { code: "PKR", country: "PAKISTANI RUPEE" },
  { code: "BDT", country: "BANGLADESHI TAKA" },
  { code: "PHP", country: "PHILIPPINE PESO" },
  { code: "EGP", country: "EGYPTIAN POUND" },
  { code: "KES", country: "KENYAN SHILLING" },
  { code: "MAD", country: "MOROCCAN DIRHAM" },
  { code: "MUR", country: "MAURITIUS RUPEE" },
  { code: "CHF", country: "SWISS FRANC" },
  { code: "VND", country: "VIETNAMESE DONG" },
  { code: "BRL", country: "BRAZILIAN REAL" },
  { code: "OMR", country: "OMANI RIYAL" },
  { code: "RUB", country: "RUSSIAN FEDERATION ROUBLE" },
  { code: "NZD", country: "NEW ZEALAND DOLLAR" },
  { code: "SEK", country: "SWEDISH KRONA" },
  { code: "AZN", country: "AZERBAIJAN MANAT(AZN)" },
  { code: "AUD", country: "AUSTRALIAN DOLLAR" },
  { code: "RSD", country: "SERBIAN DINAR" },
  { code: "BAM", country: "CONVERTIBLE MARK" },
  { code: "IDR", country: "INDONESIA RUPIAH" },
  { code: "SCP", country: "SCOTLAND POUND" },
  { code: "UGX", country: "UGANDA SHILLING" },
  { code: "GBP", country: "BRITISH POUND" },
  { code: "JPY", country: "JAPANESE YEN" },
  { code: "NOK", country: "NORWEGIAN KRONE" },
  { code: "CAD", country: "CANADIAN DOLLAR" },
  { code: "USD", country: "US DOLLAR" },
  { code: "EUR", country: "EURO" },
  { code: "SAR", country: "SAUDI RIYAL" },
  { code: "ZAR", country: "SOUTH AFRICAN RAND" },
  { code: "LBP", country: "LEBANESE POUND" },
  { code: "IEP", country: "IRISH POUND" },
  { code: "TZS", country: "TANZANIAN SHILLING" },
  { code: "NGN", country: "NAIRA" },
  { code: "PLN", country: "POLISH ZLOTY" },
  { code: "KWD", country: "KUWAITI DINAR" },
  { code: "CNY", country: "CHINESE RENMINBI YUAN" },
  { code: "GEL", country: "GEORGIAN LARI" },
  { code: "CZK", country: "CZECH KORUNA" },
  { code: "NPR", country: "NEPALESE RUPEE" },
  { code: "LKR", country: "SRI LANKAN RUPEE" },
  { code: "MYR", country: "MALAYSIAN RINGGIT" },
  { code: "DKK", country: "DANISH KRONE" },
  { code: "SCR", country: "SEYCHELLES RUPEE" },
  { code: "BHD", country: "BAHRAINI DINAR" },
  { code: "GHS", country: "GHANAIAN CEDI" },
  { code: "BND", country: "BRUNEI DOLLAR" },
  { code: "TND", country: "TUNISIAN DINAR" },
  { code: "KRW", country: "SOUTH KOREAN WON" },
  { code: "SGD", country: "SINGAPORE DOLLAR" },
  { code: "TWD", country: "TAIWAN DOLLAR" },
  { code: "HKD", country: "HONG KONG DOLLAR" },
  { code: "JOD", country: "JORDANIAN DINAR" },
  { code: "IQD", country: "IRAQI DINAR" },
  { code: "TRL", country: "TURKISH LIRA" },
  { code: "QAR", country: "QATARI RIYAL" },
  { code: "THB", country: "THAILAND BAHT" },
];

const mergedCurrencies = [
  ...luluCurrencies,
  ...fardanCurrencies,
  ...ansariCurrencies,
];

const deDuplicatedArray = new Map(
  mergedCurrencies.map((item) => [item.code, item])
).values();

const uniqueCurrencies = Array.from(deDuplicatedArray);
uniqueCurrencies.sort((a, b) => a.country.localeCompare(b.country));

console.log(uniqueCurrencies);
