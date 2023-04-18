import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  FormContainer,
  HomeContainer,
  CountdownContainer,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
  MinutesAmountInput,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

const SchemaValidacaoFormulario = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof SchemaValidacaoFormulario>

interface Ciclo {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [ciclos, setCiclos] = useState<Ciclo[]>([])
  const [cicloAtivoId, setCicloAtivoId] = useState<string | null>(null)
  const [totalSegundosPassados, setTotalSegundosPassados] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(SchemaValidacaoFormulario),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const cicloAtivo = ciclos.find((ciclo) => ciclo.id === cicloAtivoId)

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
          setCiclos((state) =>
            state.map((ciclo) => {
              if (ciclo.id === cicloAtivoId) {
                return { ...ciclo, finishedDate: new Date() }
              } else {
                return ciclo
              }
            }),
          )

          clearInterval(interval)
        } else {
          setTotalSegundosPassados(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [cicloAtivo, totalSegundos, cicloAtivoId])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const novoCiclo: Ciclo = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCiclos((state) => [...state, novoCiclo])
    setCicloAtivoId(novoCiclo.id)
    setTotalSegundosPassados(0)

    reset()
  }

  function handleInterruptedCicle() {
    setCiclos((state) =>
      state.map((ciclo) => {
        if (ciclo.id === cicloAtivoId) {
          return { ...ciclo, interruptedDate: new Date() }
        } else {
          return ciclo
        }
      }),
    )

    setCicloAtivoId(null)
  }

  console.log(ciclos)

  const segundosAtual = cicloAtivo ? totalSegundos - totalSegundosPassados : 0

  const quantidadeMinutos = Math.floor(segundosAtual / 60)
  const quantidadeSegundos = segundosAtual % 60

  const minutos = String(quantidadeMinutos).padStart(2, '0')
  const segundos = String(quantidadeSegundos).padStart(2, '0')

  useEffect(() => {
    if (cicloAtivo) {
      document.title = `${minutos}: ${segundos}`
    }
  }, [minutos, segundos, cicloAtivo])

  const task = watch('task')

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm/>
        <Countdown />

        {cicloAtivo ? (
          <StopCountdownButton type="button" onClick={handleInterruptedCicle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={!task} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
