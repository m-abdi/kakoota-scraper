function toEnglishDigit(oldString) {
  const find = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const replace = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let tempString = oldString
  for (var i = 0; i < find.length; i++) {
    let regex = new RegExp(find[i], 'g');
    tempString = tempString.replace(regex, replace[i]);
  }
  return tempString;}


console.log(toEnglishDigit('۱۲234234'));