import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from 'react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CiclosContext } from '../../contexts/CiclosContext'

const SchemaValidacaoFormulario = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof SchemaValidacaoFormulario>

export function Home() {
  const { createNewCiclo, interruptedCurrentCiclo, cicloAtivo } =
    useContext(CiclosContext)

  const newCicloForm = useForm<NewCycleFormData>({
    resolver: zodResolver(SchemaValidacaoFormulario),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCicloForm

  function handleCreateNewCiclo(data: NewCycleFormData) {
    createNewCiclo(data)
    reset()
  }

  const task = watch('task')

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCiclo)} action="">
        <FormProvider {...newCicloForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {cicloAtivo ? (
          <StopCountdownButton type="button" onClick={interruptedCurrentCiclo}>
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
