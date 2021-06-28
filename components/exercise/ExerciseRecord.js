import React, { Children } from 'react'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useFoodOptions, useGroupByDateEat, useEat } from '../../lib/hooks'
import { format } from 'date-fns-tz'
import zhTWLocale from 'date-fns/locale/zh-TW'
import DatePicker from '../DatePicker'
import SelectBox from '../SelectBox'
import DialogBox from '../DialogBox'
import { v4 as uuidv4 } from 'uuid'

const Td = props => {
  return (
    <td className='px-6 py-3 whitespace-nowrap text-sm' {...props}>
      {props.children}
    </td>
  )
}
const Th = props => (
  <th
    scope='col'
    className='bg-gray-50 top-0 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
  >
    {props.children}
  </th>
)

const FoodEditor = ({ id, value, onChange = () => { }, onDelete }) => {
  const _foodOptions = useFoodOptions()

  const [amount, setAmount] = React.useState(value.amount || 0)
  const foodNames = _foodOptions.map(op => op.foodName)
  const [foodName, setFoodName] = React.useState(value.foodName || foodNames[0])
  const unitOptions = React.useMemo(
    () => {
      const food = _foodOptions.find(op => op.foodName === foodName)
      const units = food ? food.units : (value.units || {})
      const options = Object.keys(units)
      return options
    }, [foodName]
  )
  const [unit, setUnit] = React.useState(value.unit || unitOptions[0])
  React.useEffect(() => {
    if (unitOptions.includes(unit)) {
      // do nothing
    } else {
      setUnit(unitOptions[0])
    }
  }, [unitOptions])
  React.useEffect(() => {
    const food = _foodOptions.find(op => op.foodName === foodName)
    onChange({ ...(food || value), id: value.id, amount, unit })
  }, [foodName, amount, unit])

  return (
    <div className='grid grid-cols-12 gap-4 items-baseline'>
      <div className='my-auto pt-1'>
        <MinusCircleIcon onClick={onDelete} className='w-5 h-5 cursor-pointer border border-transparent text-red-400 hover:text-red-500 focus:outline-none' />
      </div>
      <SelectBox
        label=''
        className='col-span-4'
        value={foodName}
        onChange={setFoodName}
        options={foodNames}
      />
      <input
        type='number'
        className='col-span-2 bg-white border border-gray-300 rounded-md shadow-sm p-1 pl-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
      />
      <SelectBox
        label=''
        className='col-span-3'
        value={unit}
        onChange={setUnit}
        options={unitOptions}
      />
    </div>
  )
}

const EatEditor = ({ eat, setHintId, setOpen }) => {
  const [time, setTime] = React.useState(eat.time ? new Date(eat.time) : new Date())
  const [foods, setFoods] = React.useState(eat.foods ? eat.foods : [{ id: uuidv4() }])
  const eats = useEat()
  const onCreate = async () => {
    setOpen(false)
    const body = { time, foods }
    mutate('/api/eat/read', [{ time, foods, eat_id: eatId, isUpdating: true }, ...eats], false)
    const res = await window.fetch('/api/eat/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const { eatId } = await res.json()
    mutate('/api/eat/read')

    setHintId(eatId)
    setTimeout(() => {
      setHintId(null)
    }, 1000)
  }

  const onUpdate = async () => {
    setOpen(false)
    const body = { time, foods, eatId: eat.eat_id }
    mutate('/api/eat/read', eats.map(e => e.eat_id === eat.eat_id ? { ...e, time, foods, isUpdating: true } : e), false)
    await window.fetch('/api/eat/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/eat/read')
    setHintId(eat.eat_id)
    setTimeout(() => {
      setHintId(null)
    }, 1000)
  }

  const onDelete = async () => {
    setOpen(false)
    const body = { eatId: eat.eat_id }
    mutate('/api/eat/read', eats.filter(e => e.eat_id !== eat.eat_id), false)
    await window.fetch('/api/eat/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/eat/read')
    setHintId(null)
  }

  const onSave = async () => {
    if (eat.eat_id) {
      if (foods.length) {
        onUpdate()
      } else {
        onDelete()
      }
    } else {
      if (foods.length) {
        onCreate()
      } else {
        setOpen(false)
        setHintId(null)
      }
    }
  }

  return (
    <>
      <tr>
        <td colSpan='5' className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
          <div className='mb-2'>時間</div>
          <DatePicker value={time} onChange={setTime} />
        </td>
      </tr>
      <tr>
        <td colSpan='5' className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
          <div className='mb-2'>攝入</div>
          {
            foods.map((food, i) => (
              <FoodEditor
                key={food.id}
                id={food.id}
                value={food}
                onChange={data => {
                  const _f = foods.slice(0)
                  _f[i] = data
                  setFoods(_f)
                }}
                onDelete={() => {
                  const _f = foods.slice(0)
                  _f.splice(i, 1)
                  setFoods(_f)
                }}
              />
            ))
          }
          <div
            className='px-6 pt-4 whitespace-nowrap text-sm font-medium cursor-pointer hover:text-indigo-500 text-indigo-300'
            onClick={() => {
              setFoods([...foods, { id: uuidv4() }])
            }}
          >
            <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
          </div>
        </td>
      </tr>
      <tr className='flex justify-end items-center py-4'>
        <td>
          <div className='flex justify-end items-center pr-6'>
            <button
              className='relative flex justify-center mr-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none'
              onClick={onSave}
            >
              Save
            </button>
            {eat.eat_id
              ? (
                <button
                  className='my-2 relative flex justify-center my-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none'
                  onClick={onDelete}
                >
                  Delete
                </button>
              ) : null}
          </div>
        </td>
      </tr>
    </>
  )
}

const getNutrition = food => {
  const nutritionPerUnit = food.units[food.unit] || {}
  const carbon = (nutritionPerUnit.carbon * food.amount)
  const protein = (nutritionPerUnit.protein * food.amount)
  const fat = (nutritionPerUnit.fat * food.amount)
  const calorie = (nutritionPerUnit.calorie * food.amount)
  return { carbon, protein, fat, calorie }
}

const FoodRow = ({ eat, food, dayHead, timeHead, totalRowsCount, setOpen, setEditEat }) => {
  const { carbon, protein, fat, calorie } = getNutrition(food)
  return (
    <tr>
      {
        (dayHead && timeHead) ? (
          <Td rowSpan={totalRowsCount}>
            {
              format(new Date(eat.time), 'MMMdo', {
                locale: zhTWLocale
              })
            }
          </Td>
        ) : null
      }
      {
        (timeHead) ? (
          <Td rowSpan={eat.foods.length}>
            {
              format(new Date(eat.time), 'HH:mm', {
                locale: zhTWLocale
              })
            }
          </Td>
        ) : null
      }
      {
        <>
          <Td>
            {food.foodName}
          </Td>
          <Td>
            {food.amount} {food.unit}
          </Td>
          <Td>
            {carbon.toFixed(0)} 公克
          </Td>
          <Td>
            {protein.toFixed(0)} 公克
          </Td>
          <Td>
            {fat.toFixed(0)} 公克
          </Td>
          <Td>
            {calorie.toFixed(0)} 大卡
          </Td>
          {
            timeHead ? (
              <td rowSpan={eat.foods.length} className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                <a
                  onClick={() => {
                    setEditEat(eat)
                    setOpen(true)
                  }}
                  className='text-xs text-indigo-600 hover:text-indigo-900 cursor-pointer'
                >
                  Edit
                </a>
              </td>
            ) : null
          }
        </>
      }
    </tr>
  )
}

const EatRecords = (props) => {
  const { eat } = props
  return (
    <>
      {
        eat.foods.map(
          (f, i) => {
            return (
              <FoodRow key={f.id} food={f} timeHead={i === 0}  {...props} />
            )
          }
        )
      }
    </>
  )
}

const DayGroup = (props) => {
  const { group } = props
  const totalRowsCount = group.reduce((acc, cur) => (acc + cur.foods.length), 0) + 1
  return (
    <>
      {
        group.map(
          (eat, i) => {
            return (
              <EatRecords key={i} {...props} eat={eat} dayHead={i === 0} totalRowsCount={totalRowsCount} />
            )
          }
        )
      }
      <NutritionSummary group={group} />
    </>
  )
}

const NutritionSummary = ({ group }) => {
  const nutritionOfDay = group.reduce(
    (acc, eat) => {
      const nutritionOfEat = eat.foods.reduce(
        (a, f) => {
          const { carbon, protein, fat, calorie } = getNutrition(f)
          a.carbon += carbon
          a.protein += protein
          a.fat += fat
          a.calorie += calorie
          return a
        }, { carbon: 0, protein: 0, fat: 0, calorie: 0 }
      )
      acc.carbon += nutritionOfEat.carbon
      acc.protein += nutritionOfEat.protein
      acc.fat += nutritionOfEat.fat
      acc.calorie += nutritionOfEat.calorie
      return acc
    }, { carbon: 0, protein: 0, fat: 0, calorie: 0 }
  )
  return (
    <tr className='bg-gradient-to-r from-transparent to-indigo-50'>
      <Td colSpan='3' />
      <Td>
        {nutritionOfDay.carbon.toFixed(0)} 公克
      </Td>
      <Td>
        {nutritionOfDay.protein.toFixed(0)} 公克
      </Td>
      <Td>
        {nutritionOfDay.fat.toFixed(0)} 公克
      </Td>
      <Td>
        {nutritionOfDay.calorie.toFixed(0)} 大卡
      </Td>
      <Td />
    </tr>
  )
}

const EatRecord = () => {
  const eatGroups = useGroupByDateEat()
  const [editEat, setEditEat] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  return (
    <div className=''>
      <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
        <div
          className='shadow border-gray-200 sm:rounded-lg overflow-y-auto max-h-75v'
        >
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='top-0'>
              <tr className='top-0'>
                <Th>
                  Date
                </Th>
                <Th>
                  Time
                </Th>
                <Th>
                  Foods
                </Th>
                <Th>
                  Amount
                </Th>
                <Th>
                  Carbon
                </Th>
                <Th>
                  Protein
                </Th>
                <Th>
                  Fat
                </Th>
                <Th>
                  Calorie
                </Th>
                <Th>
                  <span className='sr-only'>Edit</span>
                </Th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 text-sm'>
              {
                eatGroups.map(
                  (group, i) => <DayGroup
                    key={i}
                    group={group}
                    setOpen={setOpen}
                    setEditEat={setEditEat}
                  />
                )
              }
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan='9' className='bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500 text-indigo-300' onClick={() => {
                    setEditEat({})
                    setOpen(true)
                  }}
                >
                  <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <DialogBox open={open} setOpen={setOpen}>
          <table className='min-w-full divide-y divide-gray-200'>
            <tbody className='bg-white divide-y divide-gray-200'>
              <EatEditor
                eat={editEat}
                setOpen={setOpen}
                setHintId={setHintId}
              />
            </tbody>
          </table>
        </DialogBox>
      </div>
    </div>

  )
}

export default EatRecord
