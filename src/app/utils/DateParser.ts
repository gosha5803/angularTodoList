export class DateParser {
    parseDate(date: string) {
        const numberDate = Date.parse(date)
        
        const currentDate = new Date(+numberDate)
        // const year = currentDate.getFullYear()
        // const month = currentDate.getMonth()
        // const day = currentDate.getDate()
        const result = currentDate.getDate() + '.' 
        + (currentDate.getMonth() + 1) + '.' 
        + currentDate.getFullYear() 
        // + ' ' 
        // + currentDate.getHours() 
        // + ':' 
        // + currentDate.getMinutes()

        // const result = {
        //     year,
        //     month,
        //     day
        // }

        return result
    }
}