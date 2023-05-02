import { ReactNode, createContext, useReducer, useState } from 'react'
import { Ciclo, ciclosReducers } from '../reducers/ciclos/reducer'
import {
  addNewCycleAction,
  interruptedCurrentCicloAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/ciclos/actions'

interface CreateCicloData {
  task: string
  minutesAmount: number
}

interface CiclosContextTypes {
  ciclos: Ciclo[]
  cicloAtivo: Ciclo | undefined
  cicloAtivoId: String | null
  totalSegundosPassados: number
  markCurrentCicloAsFinished: () => void
  setSegundosPassados: (seconds: number) => void
  createNewCiclo: (data: CreateCicloData) => void
  interruptedCurrentCiclo: () => void
}

export const CiclosContext = createContext({} as CiclosContextTypes)

interface CiclosContextProviderProps {
  children: ReactNode
}

export function CiclosContextProvider({
  children,
}: CiclosContextProviderProps) {
  const [ciclosState, dispatch] = useReducer(ciclosReducers, {
    ciclos: [],
    cicloAtivoId: null,
  })

  const [totalSegundosPassados, setTotalSegundosPassados] = useState(0)

  const { ciclos, cicloAtivoId } = ciclosState

  const cicloAtivo = ciclos.find((ciclo) => ciclo.id === cicloAtivoId)

  function setSegundosPassados(seconds: number) {
    setTotalSegundosPassados(seconds)
  }

  function markCurrentCicloAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCiclo(data: CreateCicloData) {
    const novoCiclo: Ciclo = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(novoCiclo))
    setTotalSegundosPassados(0)
  }

  function interruptedCurrentCiclo() {
    dispatch(interruptedCurrentCicloAction())
  }

  return (
    <CiclosContext.Provider
      value={{
        cicloAtivo,
        cicloAtivoId,
        totalSegundosPassados,
        ciclos,
        markCurrentCicloAsFinished,
        setSegundosPassados,
        createNewCiclo,
        interruptedCurrentCiclo,
      }}
    >
      {children}
    </CiclosContext.Provider>
  )
}
