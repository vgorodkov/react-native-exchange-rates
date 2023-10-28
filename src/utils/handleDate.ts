export const handleDate = (
  mode: '1week' | '1month' | '3month' | '6month' | '1year',
) => {
  const date = new Date();

  switch (mode) {
    case '1week':
      date.setDate(date.getDate() - 7); //today is the 7th day
      break;
    case '1month':
      date.setMonth(date.getMonth() - 1);
      break;
    case '3month':
      date.setMonth(date.getMonth() - 3);
      break;
    case '6month':
      date.setMonth(date.getMonth() - 6);
      break;
    case '1year':
      date.setFullYear(date.getFullYear() - 1);
      date.setDate(date.getDate() + 1); //+1 because max response length 365 days
      break;
    default:
      break;
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const separator = '/';
  //month/day/year
  const formattedDate = `${month}${separator}${day}${separator}${year}`;

  return formattedDate;
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  return `${month}/${day}/${year}`;
};
