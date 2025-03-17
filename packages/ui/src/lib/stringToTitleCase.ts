export function stringToTitleCase(str: string) {
  if (str === null || str === "") return "";
  else str = str.toString();

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}
