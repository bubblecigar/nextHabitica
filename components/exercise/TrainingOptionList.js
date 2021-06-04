import React from 'react'
import { PlusCircleIcon, ChevronRightIcon, DotsHorizontalIcon, DotsVerticalIcon, ReplyIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useTrainingOptions, useFoodOptions } from '../../lib/hooks'

const StyledInput = ({ value, onChange, type, classNames, show }) => {
  const typeTransform = value => type === 'number' ? Number(value) : value
  return (
    <input
      type={type}
      readOnly={!show}
      disabled={!show}
      className={'w-20 col-span-2 bg-white border border-gray-300 rounded-md shadow-sm p-1 pl-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' + ' ' + classNames + ' ' + (show ? '' : 'opacity-0')}
      value={value}
      onChange={e => onChange(typeTransform(e.target.value))}
    />
  )
}

const EditableField = ({ onEdit, staticValue, value, onChange, type, classNames }) => {
  const typeTransform = value => type === 'number' ? Number(value) : value
  return (
    <div className='h-5 flex items-center justify-start'>
      {
        onEdit ? (
          <input
            type={type}
            className={'w-20 col-span-2 bg-white border border-gray-300 rounded-md shadow-sm p-1 pl-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' + ' ' + classNames}
            value={value}
            onChange={e => onChange(typeTransform(e.target.value))}
          />
        ) : (
            <span className='block px-2 p-1'>{staticValue}</span>
          )
      }
    </div>
  )
}

const FocusableField = ({ value, onChange, type, classNames }) => {
  const typeTransform = value => type === 'number' ? Number(value) : value
  return (
    <input
      type={type}
      className={'w-20 col-span-2 bg-transparent rounded-md p-1 pl-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' + ' ' + classNames}
      value={value}
      onChange={e => onChange(typeTransform(e.target.value))}
    />
  )
}


const TrainingTableEditor = ({ staticValue }) => {
  const [columns, setColumns] = React.useState([])
  const [rows, setRows] = React.useState([])
  const addColumn = () => {
    setColumns([...columns, ''])
    const _rows = rows.map(row => [...row, ''])
    setRows(_rows)
  }
  const removeColumn = i => () => {
    const _columns = columns.filter((col, n) => n !== i)
    setColumns(_columns)
    if (_columns.length === 0) {
      setRows([])
    } else {
      const _rows = rows.map(row => row.filter((entry, n) => n !== i))
      setRows(_rows)
    }
  }
  const writeColumn = i => value => {
    const _columns = columns.map((col, n) => n === i ? value : col)
    setColumns(_columns)
  }
  const addRow = () => setRows([...rows, new Array(columns.length).fill('')])
  const removeRow = i => () => {
    const _rows = rows.filter((row, n) => n !== i)
    setRows(_rows)
  }
  const writeData = (i, j) => value => {
    const _row = rows[i].slice(0)
    _row[j] = value
    setRows(rows.map((row, n) => n === i ? _row : row))
  }

  return (
    <div>
      <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
        <div
          className='shadow border-b border-gray-200 sm:rounded-lg overflow-y-auto max-h-75v'
        >
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                {
                  columns.map(
                    (col, i) => (
                      <th
                        scope='col'
                        key={i}
                        className='bg-gray-50 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        <DotsHorizontalIcon className='mx-auto h-4 w-4 mb-1 -mt-1 text-sm cursor-pointer hover:text-indigo-500 text-indigo-300' aria-hidden='true' onClick={removeColumn(i)} />
                        <FocusableField show value={col} onChange={writeColumn(i)} />
                      </th>
                    )
                  )
                }
                <th
                  scope='col'
                  onClick={addColumn}
                  className='bg-gray-50 p-3 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500 text-indigo-300'
                >
                  <ChevronRightIcon
                    className='mx-auto h-5 w-5 cursor-pointer'
                    aria-hidden='true'
                  />
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {
                rows.map(
                  (row, i) => (
                    <tr key={i}>
                      {
                        row.map(
                          (data, j) => (
                            <td
                              key={j}
                              scope='col'
                              className='bg-gray-50 p-3 whitespace-nowrap text-right text-sm font-medium'
                            >
                              <FocusableField value={data} onChange={writeData(i, j)} show />
                            </td>
                          )
                        )
                      }
                      <td>
                        <DotsVerticalIcon className='mx-auto h-4 w-4 text-sm cursor-pointer hover:text-indigo-500 text-indigo-300' aria-hidden='true' onClick={removeRow(i)} />
                      </td>
                    </tr>
                  )
                )
              }
            </tbody>
            {
              columns.length > 0
                ? (
                  <tfoot>
                    <tr>
                      <td colSpan={columns.length + 1}
                        className='bg-gray-50 p-3 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500 text-indigo-300'
                        onClick={addRow}>
                        <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
                      </td>
                    </tr>
                  </tfoot>
                ) : null
            }
          </table>
        </div>
      </div>
    </div>
  )
}

const TrainingOptionList = () => {
  return (
    <TrainingTableEditor />
  )
}

export default TrainingOptionList
