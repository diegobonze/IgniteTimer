import { useContext, useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CiclosContext } from '../../../../contexts/CiclosContext'

export function Countdown() {
  const {
    cicloAtivo,
    cicloAtivoId,
    totalSegundosPassados,
    markCurrentCicloAsFinished,
    setSegundosPassados,
  } = useContext(CiclosContext)

  const totalSegundos = cicloAtivo ? cicloAtivo.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (cicloAtivo) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          cicloAtivo.startDate,
        )

        if (secondsDifference >= totalSegundos) {
          markCurrentCicloAsFinished()

          setSegundosPassados(totalSegundos)
          clearInterval(interval)
        } else {
          setSegundosPassados(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    cicloAtivo,
    totalSegundos,
    cicloAtivoId,
    markCurrentCicloAsFinished,
    setSegundosPassados,
  ])

  const segundosAtual = cicloAtivo ? totalSegundos - totalSegundosPassados : 0

  const quantidadeMinutos = Math.floor(segundosAtual / 60)
  const quantidadeSegundos = segundosAtual % 60

  const minutos = String(quantidadeMinutos).padStart(2, '0')
  const segundos = String(quantidadeSegundos).padStart(2, '0')

  useEffect(() => {
    if (cicloAtivo) {
      document.title = `${minutos}: ${segundos}`
    } else {
      document.title = ''
    }
  }, [minutos, segundos, cicloAtivo])

  return (
    <CountdownContainer>
      <span>{minutos[0]}</span>
      <span>{minutos[1]}</span>
      <Separator>:</Separator>
      <span>{segundos[0]}</span>
      <span>{segundos[1]}</span>
    </CountdownContainer>
  )
}
