import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import isSameDay from 'date-fns/isSameDay'

const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return { user: data ?.user || null }
    })

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const { data, error } = useSWR('/api/user', fetcher)
  const user = data ?.user
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  useEffect(() => {
    if (!redirectTo || !finished) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, finished, hasUser])

  return error ? null : user
}

const jsonFetcher = (url) =>
  fetch(url)
    .then((r) => r.json())

export const useSleep = () => {
  const { data, error } = useSWR('/api/sleep/read', jsonFetcher)
  return data || []
}

export const useEat = () => {
  const { data, error } = useSWR('/api/eat/read', jsonFetcher)
  return data || []
}

export const useGroupByDateEat = () => {
  const data = useEat()
  const isEmpty = data[0] === undefined
  if (isEmpty) {
    return []
  }
  // group by date
  const groupsByDate = [[data[0]]]
  data.slice(1).forEach(d => {
    const lastGroup = groupsByDate[groupsByDate.length - 1]
    const belongToLastGroup = isSameDay(new Date(lastGroup[0].time), new Date(d.time))
    if (belongToLastGroup) {
      lastGroup.unshift(d)
    } else {
      groupsByDate.push([d])
    }
  })
  return groupsByDate || []
}

export const useFoodOptions = () => {
  const { data, error } = useSWR('/api/eat/options/read', jsonFetcher)
  return data || []
}

export const useExercise = () => {
  const { data, error } = useSWR('/api/exercise/read', jsonFetcher)
  return data || []
}

export const useTrainingOptions = () => {
  const { data, error } = useSWR('/api/exercise/options/read', jsonFetcher)
  return data || []
}
