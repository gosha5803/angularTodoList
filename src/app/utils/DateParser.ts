// Класс для работы с датой, возвращает удобный текстовый формат даты и числовое значение дедлайна для сортировке по дате.
export class DateParser {
    parseDate(date: string) {
        const numberDate = Date.parse(date)
        const currentDate = new Date(+numberDate)

        const result = currentDate.getDate() + '.' 
        + (currentDate.getMonth() + 1) + '.' 
        + currentDate.getFullYear() 

        return {stringDate: result, numberDate}
    }
}