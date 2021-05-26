import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useFoodOptions } from '../lib/hooks'
import EatRecord from '../components/EatRecord'

const StyledInput = ({ value, onChange, type, classNames, show }) => {
  const typeTransform = value => type === 'number' ? Number(value) : value
  return (
    <input
      type={type}
      readOnly={!show}
      disabled={!show}
      className={'relative w-20 col-span-2 bg-white border border-gray-300 rounded-md shadow-sm p-1 pl-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' + ' ' + classNames + ' ' + (show ? '' : 'opacity-0')}
      value={value}
      onChange={e => onChange(typeTransform(e.target.value))}
    />
  )
}

const FoodOptionEditor = ({ show, setOpen }) => {
  const _foodOptions = useFoodOptions()

  const [foodName, setFoodName] = React.useState('')
  const [unitName, setUnitName] = React.useState('')
  const [carbon, setCarbon] = React.useState(0)
  const [protein, setProtein] = React.useState(0)
  const [fat, setFat] = React.useState(0)
  const [calorie, setCalorie] = React.useState(0)

  const onSave = async () => {
    if (!foodName) {
      onCancel()
      return
    }
    const foodOption = {
      foodName,
      units: {
        [unitName]: {
          carbon,
          protein,
          fat,
          calorie
        }
      },
      unit: unitName,
      amount: 0
    }
    // merge with current _foodOptions
    const existOptions = _foodOptions.find(op => op.foodName === foodName)
    if (existOptions) {
      // merge old food option with new unit
      const mergedOption = {
        foodName,
        units: {
          ...existOptions.units,
          ...foodOption.units
        },
        unit: unitName,
        amount: 0
      }
      const mergedOptions = _foodOptions.map(op => op.foodName === foodName ? mergedOption : op)
      await window.fetch('/api/eat/options/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodOptions: mergedOptions })
      })
      mutate('/api/eat/options/read', mergedOptions)
    } else {
      // add new food option
      await window.fetch('/api/eat/options/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodOptions: [..._foodOptions, foodOption] })
      })
      mutate('/api/eat/options/read', [..._foodOptions, foodOption])
    }
    onCancel()
  }

  const onCancel = () => {
    setFoodName('')
    setUnitName('')
    setCarbon(0)
    setProtein(0)
    setFat(0)
    setCalorie(0)
    setOpen(false)
  }

  return (
    <>
      <tr>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          <StyledInput
            classNames='w-32'
            type='text'
            show={show}
            value={foodName}
            onChange={setFoodName}
          />
        </td>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          <StyledInput show={show} type='text' value={unitName} onChange={setUnitName} />
        </td>
        <td
          scope='col'
          className='bg-gray-50  top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          <StyledInput show={show} type='number' value={carbon} onChange={setCarbon} />
        </td>
        <td
          scope='col'
          className='bg-gray-50  top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          <StyledInput show={show} type='number' value={protein} onChange={setProtein} />
        </td>
        <td
          scope='col'
          className='bg-gray-50  top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          <StyledInput show={show} type='number' value={fat} onChange={setFat} />
        </td>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          <StyledInput show={show} type='number' value={calorie} onChange={setCalorie} />
        </td>
        <td
          scope='col'
          className='bg-gray-50 px-6 py-4 whitespace-nowrap text-right text-sm font-medium'
        >
          <a
            onClick={onSave}
            className={'mr-3 text-xs text-indigo-600 hover:text-indigo-900' + (show ? '  cursor-pointer' : ' pointer-events-none opacity-0')}
          >
            Save
          </a>
          <a
            onClick={onCancel}
            className={'text-xs text-indigo-600 hover:text-indigo-900' + (show ? '  cursor-pointer' : ' pointer-events-none opacity-0')}
          >
            Cancel
          </a>
        </td>
      </tr>
    </>
  )
}

const UnitEditor = ({ option, unit, i }) => {
  const [onEdit, setOnEdit] = React.useState(false)
  const [unitName, setUnitName] = React.useState(unit)
  const [carbon, setCarbon] = React.useState(option.units[unit].carbon)
  const [protein, setProtein] = React.useState(option.units[unit].protein)
  const [fat, setFat] = React.useState(option.units[unit].fat)
  const [calorie, setCalorie] = React.useState(option.units[unit].calorie)

  const units = Object.keys(option.units)

  const onSave = () => {}
  const onCancel = () => { setOnEdit(false) }
  const onDelete = () => {}

  return (
    <React.Fragment key={unit + i}>
      <tr>
        {
          i === 0 ? (
            <td
              scope='col'
              className='bg-gray-50  top-0 pl-3 p-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' rowSpan={units.length}
            >
              {option.foodName}
            </td>
          ) : null
        }
        <td
          scope='col'
          className='bg-gray-50 top-0 p-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          {
            onEdit
              ? (
                <StyledInput show value={unitName} onChange={setUnitName} />
              ) : unit
          }
        </td>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          {
            onEdit
              ? (
                <StyledInput show value={carbon} type='number' onChange={setCarbon} />
              ) : option.units[unit].carbon
          }
        </td>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          {
            onEdit
              ? (
                <StyledInput show value={protein} type='number' onChange={setProtein} />
              ) : option.units[unit].protein
          }
        </td>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          {
            onEdit
              ? (
                <StyledInput show value={fat} type='number' onChange={setFat} />
              ) : option.units[unit].fat
          }
        </td>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        >
          {
            onEdit
              ? (
                <StyledInput show value={calorie} type='number' onChange={setCalorie} />
              ) : option.units[unit].calorie
          }
        </td>
        <td
          scope='col'
          className='bg-gray-50 top-0 p-3 pr-6 text-xs font-medium text-gray-500 tracking-wider text-right'
        >
          {
            onEdit ? (
              <>
                <a
                  onClick={onDelete}
                  className='mr-3 text-xs text-indigo-600 hover:text-indigo-900 cursor-pointer'
                >
                 Del
                </a>
                <a
                  onClick={onSave}
                  className='mr-3 text-xs text-indigo-600 hover:text-indigo-900 cursor-pointer'
                >
                 Save
                </a>
                <a
                  onClick={onCancel}
                  className='text-xs text-indigo-600 hover:text-indigo-900 cursor-pointer'
                >
                  x
                </a>
              </>
            ) : (
              <a
                onClick={() => setOnEdit(!onEdit)}
                className='text-xs text-indigo-600 hover:text-indigo-900 cursor-pointer'
              >
                Edit
              </a>
            )
          }
        </td>
      </tr>
    </React.Fragment>
  )
}

const FoodOptionRow = ({ option }) => {
  const units = Object.keys(option.units)

  return (
    <>
      {units.map(
        (unit, i) => <UnitEditor key={unit + i} option={option} unit={unit} i={i} />
      )}
    </>

  )
}

const FoodOptions = () => {
  const [open, setOpen] = React.useState(false)
  const _foodOptions = useFoodOptions()
  return (
    <div className=''>
      <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
        <div
          className='shadow border-b border-gray-200 sm:rounded-lg overflow-y-auto max-h-75v'
        >
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='sticky top-0'>
              <tr className='sticky top-0'>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                    Food
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                    unit
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                    Carbon
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                    Protein
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                    Fat
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                    Calorie
                </th>
                <th
                  scope='col'
                  className='bg-gray-50 sticky top-0 relative px-3 py-3'
                >
                  <span className='sr-only'>Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 text-sm'>
              {
                _foodOptions.map((op, j) => <FoodOptionRow key={j} option={op} />)
              }
              <FoodOptionEditor
                show={open}
                setOpen={setOpen}
              />
            </tbody>
          </table>
        </div>
        {
          open ? null : (
            <div
              colSpan='5'
              className='-mt-12 relative  pt-3 mx-2 bg-gray-50 h-12 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500 text-indigo-300'
              onClick={() => {
                setOpen(true)
              }}
            >
              <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default function Eat (props) {
  return (
    <div className='flex flex-col'>
      <EatRecord />
      <FoodOptions />
    </div>
  )
}
