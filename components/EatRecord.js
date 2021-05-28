import React from 'react'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useEat, useFoodOptions } from '../lib/hooks'
import { format } from 'date-fns-tz'
import zhTWLocale from 'date-fns/locale/zh-TW'
import DatePicker from '../components/DatePicker'
import SelectBox from '../components/SelectBox'
import DialogBox from '../components/DialogBox'
import { v4 as uuidv4 } from 'uuid'

const FoodEditor = ({ id, value, onChange = () => {}, onDelete }) => {
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

const EatEditor = ({ eat, setHintId, setOpen, scrollRef }) => {
  const [time, setTime] = React.useState(eat.time ? new Date(eat.time) : new Date())
  const [foods, setFoods] = React.useState(eat.foods ? eat.foods : [{ id: uuidv4() }])
  const eats = useEat()
  const onCreate = async () => {
    setOpen(false)
    const body = { time, foods }
    const res = await window.fetch('/api/eat/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const { eatId } = await res.json()
    await mutate('/api/eat/read', [null, ...eats])
    setHintId(eatId)
    setTimeout(() => {
      setHintId(null)
    }, 1000)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }

  const onUpdate = async () => {
    setOpen(false)
    const body = { time, foods, eatId: eat.eat_id }
    await window.fetch('/api/eat/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/eat/read', eats.map(e => e.eat_id === eat.eat_id ? null : e))
    setHintId(eat.eat_id)
    setTimeout(() => {
      setHintId(null)
    }, 1000)
  }

  const onDelete = async () => {
    setOpen(false)
    const body = { eatId: eat.eat_id }
    await window.fetch('/api/eat/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/eat/read', eats.filter(e => e.eat_id !== eat.eat_id))
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

const EatRow = ({ eat, hintId, setEditEat, setOpen }) => {
  return (
    <>
      {
        eat.foods.map(
          (f, i) => {
            const nutritionPerUnit = f.units[f.unit] || {}
            const carbon = (nutritionPerUnit.carbon * f.amount).toFixed(0)
            const protein = (nutritionPerUnit.protein * f.amount).toFixed(0)
            const fat = (nutritionPerUnit.fat * f.amount).toFixed(0)
            const calories = (nutritionPerUnit.calorie * f.amount).toFixed(0)
            return (
              <tr
                key={f.id} className={hintId === eat.eat_id
                  ? 'transition-colors duration-1000 bg-indigo-50 text-right'
                  : 'transition-colors duration-1000  text-right'}
              >
                {i === 0 ? (
                  <>
                    <td rowSpan={eat.foods.length} className='px-6 py-4 whitespace-nowrap'>
                      {
                        format(new Date(eat.time), 'MMMdo', {
                          locale: zhTWLocale
                        })
                      }
                    </td>
                    <td rowSpan={eat.foods.length} className='px-6 py-4 whitespace-nowrap'>
                      {
                        format(new Date(eat.time), 'HH:mm', {
                          locale: zhTWLocale
                        })
                      }
                    </td>
                  </>
                ) : null}
                <td className='px-6 py-4 whitespace-nowrap'>
                  {f.foodName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {f.amount} {f.unit}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {carbon} 公克
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {protein} 公克
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {fat} 公克
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {calories} 卡
                </td>
                {
                  i === 0 ? (
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
              </tr>
            )
          }
        )
      }
    </>
  )
}

const EatRecord = () => {
  const eats = useEat()
  const [editEat, setEditEat] = React.useState(null)
  const [hintId, setHintId] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const scrollRef = React.useRef(null)
  return (
    <div className=''>
      <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
        <div
          className='shadow border-gray-200 sm:rounded-lg overflow-y-auto max-h-75v'
          ref={scrollRef}
        >
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='sticky top-0'>
              <tr className='sticky top-0'>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Date
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Time
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Foods
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Amount
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Carbon
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Protein
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Fat
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                      Calorie
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 relative px-6 py-3'
                >
                  <span className='sr-only'>Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 text-sm'>
              {eats.map((e, i) => (
                e
                  ? (
                    <EatRow
                      key={e.eat_id}
                      eat={e}
                      setEditEat={setEditEat}
                      hintId={hintId}
                      setOpen={setOpen}
                    />
                  ) : (
                    <tr key={i}>
                      <td colSpan='9' className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900 text-center'>
                              updating...
                        </div>
                      </td>
                    </tr>
                  )
              )
              )}
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
                scrollRef={scrollRef}
              />
            </tbody>
          </table>
        </DialogBox>
      </div>
    </div>

  )
}

export default EatRecord
