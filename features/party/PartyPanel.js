import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPartyMembers } from './partySlice'

const PartyPanel = () => {
  const partyMembers = useSelector(state => state.party.members)
  const dispatch = useDispatch()
  useEffect(
    () => {
      dispatch(fetchPartyMembers())
    }, []
  )

  return (
    <div>
        Party Panel
      <ul>
        {
          partyMembers.map(
            member => (
              <li key={member.entryid}>
                name: {member.guestname}
              </li>
            )
          )
        }
      </ul>
    </div>
  )
}

export default PartyPanel
