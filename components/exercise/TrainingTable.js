import React from 'react'
import { PlusIcon, MinusSmIcon, TrashIcon, CloudUploadIcon, ReplyIcon, PencilAltIcon, PencilIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useExercise } from '../../lib/hooks'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns-tz'
import zhTWLocale from 'date-fns/locale/zh-TW'
import DatePicker from '../DatePicker'
import DialogBox from '../DialogBox'

const FocusableField = ({ value, onChange, onFocus, onBlur, type, classNames, onEdit }) => {
  const typeTransform = value => type === 'number' ? Number(value) : value
  return (
    <input
      type={type}
      className={'w-20 col-span-2 bg-transparent p-2 text-left focus:outline-none sm:text-sm' + ' ' + classNames}
      value={value}
      disabled={!onEdit}
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

const TrainingTable = ({ editable, closeCreation, initEditState = false, staticValue, exercise_id }) => {
  const exercise = useExercise()
  const [onEdit, setOnEdit] = React.useState(initEditState)
  const [time, setTime] = React.useState(staticValue.time)
  const [openDatePicker, setOpenDatePicker] = React.useState(false)
  const [columns, setColumns] = React.useState(staticValue.columns)
  const [rows, setRows] = React.useState(staticValue.rows)
  const [focus, setFocus] = React.useState([null, null])
  const resetTable = () => {
    setColumns(staticValue ? staticValue.columns : [])
    setRows(staticValue ? staticValue.rows : [])
    setFocus([null, null])
  }
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
  const onSave = async () => {
    const body = {
      training_table: { columns, rows },
      exercise_id,
      time
    }
    if (initEditState) { // create
      closeCreation()
      body.exercise_id = uuidv4()
      const newExercise = [{ ...body }, ...exercise].sort(
        (e1, e2) => e1 - e2
      )
      mutate('/api/exercise/read', newExercise, false)
      await window.fetch('/api/exercise/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      mutate('/api/exercise/read')
    } else { // update
      setOnEdit(false)
      const newExercise = exercise.map(e => e.exercise_id === exercise_id ? { ...e, ...body } : e).sort(
        (e1, e2) => e1 - e2
      )
      mutate('/api/exercise/read', newExercise, false)
      await window.fetch('/api/exercise/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      mutate('/api/exercise/read')
    }
  }
  const onDelete = async () => {
    const body = { exercise_id }
    mutate('/api/exercise/read', exercise.filter(e => e.exercise_id !== exercise_id), false)
    await window.fetch('/api/exercise/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/exercise/read')
  }

  return (
    <div className='my-8'>
      <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
        <div className='shadow border-gray-200 sm:rounded-lg relative'>
          <div className='flex absolute -top-8 left-0 text-gray-400 text-sm'>
            {
              format(new Date(time), 'Y ??? MMM do HH:mm', {
                locale: zhTWLocale
              })
            }
            {onEdit ? <div className='has-tooltip'>
              <PencilIcon onClick={() => setOpenDatePicker(!openDatePicker)} className={'ml-2 mx-auto h-4 w-4 text-sm cursor-pointer' + ' ' + (openDatePicker ? 'text-indigo-500' : 'text-gray-300')} aria-hidden='true' />
              <span className='tooltip text-indigo-500'>edit date</span>
            </div> : null}
          </div>
          <DialogBox open={openDatePicker} setOpen={setOpenDatePicker}>
            <div className='h-48 pr-10 py-8' style={{ width: '500px' }}>
              <DatePicker value={time} onChange={setTime} />
              <div className='mt-16 flex justify-end items-center'>
                <button
                  className='relative flex justify-center mr-5 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none'
                  onClick={() => setOpenDatePicker(false)}
                >
                  Done
                </button>
                <button
                  className='relative flex justify-center my-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none'
                  onClick={() => {
                    setTime(staticValue.time)
                    setOpenDatePicker(false)
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </DialogBox>
          {
            (initEditState || !editable) ? null : <div className='has-tooltip absolute -left-10 top-4'>
              <PencilAltIcon onClick={() => setOnEdit(!onEdit)} className={'mx-auto h-4 w-4 text-sm cursor-pointer' + ' ' + (onEdit ? 'text-indigo-500' : 'text-gray-300')} aria-hidden='true' />
              <span className='tooltip text-indigo-500'>toggle edit mode</span>
            </div>
          }
          {
            onEdit ? (
              <div className='has-tooltip absolute -left-10 top-12'>
                <CloudUploadIcon onClick={onSave} className='mx-auto h-4 w-4 text-sm text-gray-300 hover:text-indigo-500 cursor-pointer' aria-hidden='true' />
                <span className='tooltip text-indigo-500'>save changes</span>
              </div>
            ) : null
          }
          {
            onEdit ? (
              <div className='has-tooltip absolute -left-10 top-20'>
                {
                  initEditState
                    ? <TrashIcon onClick={closeCreation} className='mx-auto h-4 w-4 text-sm text-gray-300 hover:text-red-500 cursor-pointer' aria-hidden='true' />
                    : <ReplyIcon onClick={resetTable} className='mx-auto h-4 w-4 text-sm text-gray-300 hover:text-red-500 cursor-pointer' aria-hidden='true' />
                }
                <span className='tooltip text-red-400'>{
                  initEditState
                    ? 'adandon table'
                    : 'discard changes'
                }</span>

              </div>
            ) : null
          }
          {
            onEdit ? (
              <div className='has-tooltip absolute -left-10 top-28'>
                {
                  initEditState
                    ? null
                    : <TrashIcon onClick={onDelete} className='mx-auto h-4 w-4 text-sm text-gray-300 hover:text-red-500 cursor-pointer' aria-hidden='true' />
                }
                <span className='tooltip text-red-400'>delete table</span>
              </div>
            ) : null
          }
          <table>
            <tbody>
              <tr>
                {
                  onEdit && columns.length === 0 ? null :
                    <th className='p-2'>
                      <MinusSmIcon className='mx-auto h-4 w-4 text-sm text-transparent' aria-hidden='true' />
                    </th>
                }
                {
                  columns.map(
                    (col, i) => (
                      <th tag='th' key={i}>
                        {
                          onEdit && (focus[1] === i ? (
                            <div className='has-tooltip'>
                              <MinusSmIcon
                                className='mx-auto h-4 w-4 text-sm cursor-pointer hover:text-red-500 text-red-300' aria-hidden='true' onMouseDown={removeColumn(i)}
                              />
                              <span className='tooltip text-red-400'>remove column</span>
                            </div>
                          ) : <MinusSmIcon
                              className='mx-auto h-4 w-4 text-transparent' aria-hidden='true'
                            />)
                        }
                      </th>
                    )
                  )
                }
              </tr>
              <tr>
                <th></th>
                {
                  (onEdit ? columns : staticValue.columns).map(
                    (col, i) => (
                      <Cell tag='th' key={i} className={'bg-gray-100 text-left text-xs font-medium tracking-wider border border-gray-200'} >
                        <FocusableField show value={col} onChange={writeColumn(i)} onFocus={onFocus(-1, i)} onEdit={onEdit} onBlur={onBlur} />
                      </Cell>
                    )
                  )
                }
                {onEdit
                  ? (columns.length === 0
                    ? <td className='p-10 cursor-pointer text-sm hover:text-indigo-500 text-indigo-300' onClick={addColumn}>Create Column</td>
                    : <td tag='th' onClick={addColumn} rowSpan={rows.length + 1} className='has-tooltip p-2 cursor-pointer text-sm hover:text-indigo-500 text-indigo-300'>
                      <PlusIcon
                        className='mx-auto h-5 w-5'
                        aria-hidden='true'
                      />
                      <span className='tooltip text-indigo-500'>add column</span>
                    </td>
                  ) : <td tag='th' rowSpan={rows.length + 1} className='p-2 text-sm'>
                    <PlusIcon
                      className='mx-auto h-5 w-5 text-transparent'
                      aria-hidden='true'
                    />
                  </td>}
              </tr>
              {
                (onEdit ? rows : staticValue.rows).map(
                  (row, i) => (
                    <tr key={i}>
                      {
                        onEdit && focus[0] === i
                          ? (
                            <td>
                              <div className='has-tooltip'>
                                <MinusSmIcon className='mx-auto h-4 w-4 text-sm cursor-pointer hover:text-red-500 text-red-300' aria-hidden='true' onMouseDown={removeRow(i)} />
                                <span className='tooltip text-red-400'>remove row</span>
                              </div>
                            </td>
                          ) : <td>
                            <MinusSmIcon className='mx-auto h-4 w-4 text-sm text-transparent' aria-hidden='true' />
                          </td>
                      }
                      {
                        row.map(
                          (data, j) => (
                            <Cell key={j} tag='td'>
                              <FocusableField value={data} onChange={writeData(i, j)} show onFocus={onFocus(i, j)} onEdit={onEdit} onBlur={onBlur} />
                            </Cell>
                          )
                        )
                      }
                    </tr>
                  )
                )
              }
            </tbody>
            {getFoot(onEdit, columns, staticValue, addRow)}
          </table>
        </div>
      </div>
    </div>
  )
}

const getFoot = (onEdit, columns, staticValue, addRow) => {
  if (onEdit && columns.length === 0) {
    return null
  }
  if (!onEdit && staticValue.columns.length === 0) {
    return null
  }
  if (onEdit && columns.length > 0) {
    return <tfoot>
      <tr>
        <td></td>
        <td colSpan={columns.length}
          className='has-tooltip bg-transparent p-3 whitespace-nowrap text-sm font-medium  cursor-pointer hover:text-indigo-500 text-indigo-300 relative'
          onClick={addRow}>
          <PlusIcon className='mx-auto h-5 w-5' aria-hidden='true' />
          <span className='tooltip text-indigo-500 bottom-0 left-1/2'>add row</span>
        </td>
      </tr>
    </tfoot>
  }
  if (!onEdit && staticValue.columns.length > 0) {
    return <tfoot>
      <tr>
        <td></td>
        <td colSpan={columns.length}
          className='bg-transparent p-3 whitespace-nowrap text-sm font-medium text-transparent'>
          <PlusIcon className='mx-auto h-5 w-5' aria-hidden='true' />
        </td>
      </tr>
    </tfoot>
  }
}

const TrainingTableCreator = () => {
  const [onCreate, setOnCreate] = React.useState(false)
  return onCreate ? <TrainingTable closeCreation={() => setOnCreate(false)} initEditState staticValue={{ columns: ['', '', ''], rows: [['', '', ''], ['', '', '']], time: new Date() }} /> : <div className='p-5 m-8 mt-0 shadow border-gray-200 sm:rounded-lg cursor-pointer text-sm hover:text-indigo-500 text-indigo-300' onClick={() => setOnCreate(true)}>Create Table +</div>
}

export default TrainingTable
export { TrainingTableCreator }
