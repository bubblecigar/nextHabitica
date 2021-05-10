import React, { useState } from 'react'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import SelectBox from './SelectBox'

const DatePicker = ({ value, onChange }) => {
  const [year, setYear] = useState(value.getFullYear())
  const yearOptions = React.useMemo(() => {
    const _year = value.getFullYear()
    const yearOptions = [_year - 2, _year - 1, _year, _year + 1, _year + 2]
    return yearOptions
  }, [value])
  const [month, setMonth] = useState(value.getMonth() + 1)
  const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [date, setDate] = useState(value.getDate())
  const dateOptions = React.useMemo(
    () => {
      const start = new Date(year, month - 1)
      const end = new Date(year, month)
      const datesWithin = eachDayOfInterval({ start, end })
      const dateOptions = datesWithin.slice(1).map((v, i) => i + 1)
      return dateOptions
    }, [year, month]
  )
  React.useEffect(
    () => {
      if (!dateOptions.includes(date)) {
        setDate(1)
      }
    }, [year, month]
  )

  const [hour, setHour] = useState(value.getHours())
  const hourOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  const [minute, setMinute] = useState(value.getMinutes())
  const minuteOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]

  React.useEffect(
    () => {
      onChange(new Date(year, month - 1, date, hour, minute))
    }, [year, month, date, hour, minute]
  )

  return (
    <div className='grid grid-cols-12 gap-4'>
      <div />
      <SelectBox
        label='年'
        className='col-span-3'
        value={year}
        onChange={setYear}
        options={yearOptions}
      />
      <SelectBox
        label='月'
        className='col-span-2'
        value={month}
        onChange={setMonth}
        options={monthOptions}
      />
      <SelectBox
        label='日'
        className='col-span-2'
        value={date}
        onChange={setDate}
        options={dateOptions}
      />
      <SelectBox
        label='時'
        className='col-span-2'
        value={hour}
        onChange={setHour}
        options={hourOptions}
      />
      <SelectBox
        label='分'
        className='col-span-2'
        value={minute}
        onChange={setMinute}
        options={minuteOptions}
      />
    </div>
  )
}

export default DatePicker
