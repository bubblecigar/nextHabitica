import { useSelector, useDispatch } from 'react-redux'
import { setName } from './userSlice'

const UserPanel = () => {
  const userName = useSelector(state => state.user.name)
  const userId = useSelector(state => state.user.id)
  const dispatch = useDispatch()
  const onSetName = () => {
    dispatch(setName())
  }
  return (
    <div>
        User Panel
      <p>user name: {userName}</p>
      <p>user id: {userId}</p>
      <button onClick={onSetName}>setName</button>
    </div>
  )
}

export default UserPanel
