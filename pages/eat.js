import React from 'react'
import EatRecord from '../components/EatRecord'
import FoodOptionList from '../components/FoodOptionList'

export default function Eat (props) {
  return (
    <div className='flex flex-col'>
      <EatRecord />
      <FoodOptionList />
    </div>
  )
}
