type MonthYear = {
  month: number;     // 해당 월 (1월은 1, 12월은 12)
  year: number;      // 해당 연도
  startDate: Date;   // 해당 월의 시작 날짜 (1일)
  firstDOW: number;  // 해당 월의 첫 번째 요일 (0: 일요일, 6: 토요일)
  lastDate: number;  // 해당 월의 마지막 날짜 (30, 31, 28 등)
};

// 주어진 날짜 또는 문자열을 받아 연도, 월, 일을 추출하는 함수
function getDateDetails(dateString: Date | string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return {year, month, day};
}

// 주어진 초기 날짜를 기준으로 해당 월의 세부 정보를 반환하는 함수
function getMonthYearDetails(initialDate: Date) {
  const month = initialDate.getMonth() + 1;
  const year = initialDate.getFullYear();
  const startDate = new Date(`${year}-${month}`);
  const firstDOW = startDate.getDay();
  const lastDateString = String(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth() + 1,
      0,
    ).getDate(),
  );
  const lastDate = Number(lastDateString);

  return {month, year, startDate, firstDOW, lastDate};
}

// 날짜를 지정된 구분자와 함께 문자열 형식으로 변환하는 함수
function getDateWithSeparator(
  dateString: Date | string,
  separator: string = '',
) {
  const {year, month, day} = getDateDetails(dateString);

  return [
    String(year),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join(separator);
}

// 현재 월과 연도를 기준으로 이전 또는 다음 달의 정보를 가져오는 함수
function getNewMonthYear(prevData: MonthYear, increment: number) {
  const newMonthYear = new Date(
    prevData.startDate.setMonth(prevData.startDate.getMonth() + increment),
  );

  return getMonthYearDetails(newMonthYear);
}

// 주어진 연도, 월, 날짜가 현재 날짜와 동일한지 확인하는 함수
function isSameAsCurrentDate(year: number, month: number, date: number) {
  const currentDate = getDateWithSeparator(new Date());
  const inputDate = `${year}${String(month).padStart(2, '0')}${String(
    date,
  ).padStart(2, '0')}`;

  return currentDate === inputDate;
}

export {
  getDateDetails,
  getNewMonthYear,
  getMonthYearDetails,
  isSameAsCurrentDate,
  getDateWithSeparator,
};
export type {MonthYear};
