const specialCharacterMap: Record<string, string> = {
  А: "A",
  а: "a",
  Ә: "A",
  ә: "a",
  Б: "B",
  б: "b",
  В: "V",
  в: "v",
  Г: "G",
  г: "g",
  Ғ: "G",
  ғ: "g",
  Д: "D",
  д: "d",
  Е: "E",
  е: "e",
  Ё: "Yo",
  ё: "yo",
  Є: "Ye",
  є: "ye",
  Ж: "Zh",
  ж: "zh",
  З: "Z",
  з: "z",
  И: "I",
  и: "i",
  І: "I",
  і: "i",
  Ї: "Yi",
  ї: "yi",
  Й: "Y",
  й: "y",
  К: "K",
  к: "k",
  Қ: "Q",
  қ: "q",
  Л: "L",
  л: "l",
  М: "M",
  м: "m",
  Н: "N",
  н: "n",
  Ң: "Ng",
  ң: "ng",
  О: "O",
  о: "o",
  Ө: "O",
  ө: "o",
  П: "P",
  п: "p",
  Р: "R",
  р: "r",
  С: "S",
  с: "s",
  Т: "T",
  т: "t",
  У: "U",
  у: "u",
  Ұ: "U",
  ұ: "u",
  Ү: "U",
  ү: "u",
  Ф: "F",
  ф: "f",
  Х: "Kh",
  х: "kh",
  Һ: "H",
  һ: "h",
  Ц: "Ts",
  ц: "ts",
  Ч: "Ch",
  ч: "ch",
  Ш: "Sh",
  ш: "sh",
  Щ: "Sch",
  щ: "sch",
  Ъ: "",
  ъ: "",
  Ы: "Y",
  ы: "y",
  Ь: "",
  ь: "",
  Э: "E",
  э: "e",
  Ю: "Yu",
  ю: "yu",
  Я: "Ya",
  я: "ya",
  ß: "ss",
  Æ: "AE",
  æ: "ae",
  Œ: "OE",
  œ: "oe",
  Ø: "O",
  ø: "o",
  Þ: "Th",
  þ: "th",
  Đ: "D",
  đ: "d",
  Ł: "L",
  ł: "l",
  ı: "i",
};

function transliterateToLatin(value: string) {
  return Array.from(value)
    .map((character) => {
      if (specialCharacterMap[character]) {
        return specialCharacterMap[character];
      }

      if (specialCharacterMap[character] === "") {
        return "";
      }

      return character.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    })
    .join("");
}

export function createProductSlug(value: string) {
  const transliteratedValue = transliterateToLatin(value)
    .replace(/&/g, " and ")
    .replace(/[@]/g, " at ");

  const normalizedSlug = transliteratedValue
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalizedSlug || "new-product";
}
