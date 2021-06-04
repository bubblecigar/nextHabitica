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

const FocusableField = ({ value, onChange, onFocus, onBlur, type, classNames }) => {
  const typeTransform = value => type === 'number' ? Number(value) : value
  return (
    <input
      type={type}
      className={'w-20 col-span-2 bg-transparent p-2 text-left focus:outline-none sm:text-sm' + ' ' + classNames}
      value={value}
      onFocus={e => onFocus(e)}
      onBlur={e => onBlur(e)}
      onChange={e => onChange(typeTransform(e.target.value))}
    />
  )
}


const Cell = (props) => {
  return (
    <props.tag
      scope='col'
      className='bg-gray-50 text-left text-xs font-medium text-gray-500 tracking-wider border border-gray-200'
      {...props}
    >{props.children}</props.tag>
  )
}

const TrainingTableEditor = ({ staticValue }) => {
  const [columns, setColumns] = React.useState([])
  const [rows, setRows] = React.useState([])
  const [focus, setFocus] = React.useState([null, null])
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
  const onFocus = (row, col) => () => {
    setFocus([row, col])
  }
  const onBlur = () => {
    setFocus([null, null])
  }

  return (
    <div>
      <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
        <div>
          <table className='min-w-full'>
            <thead>
              <tr>
                {
                  columns.map(
                    (col, i) => (
                      <th tag='th' key={i}>
                        {
                          focus[1] === i ? (
                            <DotsHorizontalIcon
                              className='mx-auto h-4 w-4 text-sm cursor-pointer hover:text-indigo-500 text-indigo-300' aria-hidden='true' onClick={removeColumn(i)}
                            />
                          ) : <DotsHorizontalIcon
                              className='mx-auto h-4 w-4 text-transparent' aria-hidden='true' onClick={removeColumn(i)}
                            />
                        }
                      </th>
                    )
                  )
                }
              </tr>
              <tr>
                {
                  columns.map(
                    (col, i) => (
                      <Cell tag='th' key={i}>
                        <FocusableField show value={col} onChange={writeColumn(i)} onFocus={onFocus(-1, i)} onBlur={onBlur} />
                      </Cell>
                    )
                  )
                }
                <td tag='th' onClick={addColumn}>
                  <ChevronRightIcon
                    className='mx-auto h-5 w-5 cursor-pointer text-sm hover:text-indigo-500 text-indigo-300'
                    aria-hidden='true'
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              {
                rows.map(
                  (row, i) => (
                    <tr key={i}>
                      {
                        row.map(
                          (data, j) => (
                            <Cell key={j} tag='td'>
                              <FocusableField value={data} onChange={writeData(i, j)} show onFocus={onFocus(i, j)} onBlur={onBlur} />
                            </Cell>
                          )
                        )
                      }
                      {
                        focus[0] === i
                          ? (
                            <td>
                              <DotsVerticalIcon className='mx-auto h-4 w-4 text-sm cursor-pointer hover:text-indigo-500 text-indigo-300' aria-hidden='true' onClick={removeRow(i)} />
                            </td>
                          ) : null
                      }
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
                      <td colSpan={columns.length}
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
