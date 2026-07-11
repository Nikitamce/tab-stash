import browser from "webextension-polyfill";

/**
 * Returns a localized string for the given key.
 * If the key is not found or translation fails, returns the key itself.
 */
export function $t(key: string, substitutions?: string | string[]): string {
  try {
    const val = browser.i18n.getMessage(key, substitutions);
    return val || key;
  } catch (e) {
    return key;
  }
}

/**
 * Returns a pluralized localized string.
 * E.g. keyBase = "group" -> keyBase_one, keyBase_few (Ru only), keyBase_many
 */
export function $tPlural(n: number, keyBase: string, substitutions: string[] = []): string {
  try {
    const isRu = browser.i18n.getUILanguage().startsWith("ru");
    let key = `${keyBase}_many`;
    if (isRu) {
      const pr = new Intl.PluralRules("ru-RU");
      const rule = pr.select(n);
      if (rule === "one") key = `${keyBase}_one`;
      else if (rule === "few") key = `${keyBase}_few`;
    } else {
      if (n === 1) key = `${keyBase}_one`;
    }
    const val = browser.i18n.getMessage(key, [n.toString(), ...substitutions]);
    return val || `${n} ${keyBase}`;
  } catch (e) {
    return `${n} ${keyBase}`;
  }
}

