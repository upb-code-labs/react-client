export function getCourseInitials(courseName: string) {
  const hasOneWord = courseName.split(" ").length === 1;
  if (hasOneWord) {
    const firstTwoLetters = courseName.slice(0, 2);
    return firstTwoLetters.toUpperCase();
  } else {
    const firstTwoWords = courseName.split(" ").slice(0, 2);
    const firstLetterOfEachWord = firstTwoWords.map((word) => word[0]);
    return firstLetterOfEachWord.join("").toUpperCase();
  }
}
