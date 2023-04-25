import { ReactNode, createContext, useReducer, useState } from 'react'

interface CreateCicloData {
  task: string
  minutesAmount: number
}

interface Ciclo {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
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

interface CiclosState {
  ciclos: Ciclo[]
  cicloAtivoId: string | null
}

export function CiclosContextProvider({
  children,
}: CiclosContextProviderProps) {
  const [ciclosState, dispatch] = useReducer(
    (state: CiclosState, action: any) => {
      switch (action.type) {
        case 'ADD_NEW_CICLO':
          return {
            ...state,
            ciclos: [...state.ciclos, action.payload.novoCiclo],
            cicloAtivoId: action.payload.novoCiclo.id,
          }
        case 'INTERRUPT_CURRENT_CYCLE':
          return {
            ...state,
            ciclos: state.ciclos.map((ciclo) => {
              if (ciclo.id === state.cicloAtivoId) {
                return { ...ciclo, interruptedDate: new Date() }
              } else {
                return ciclo
              }
            }),
            cicloAtivoId: null,
          }
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
          return {
            ...state,
            ciclos: state.ciclos.map((ciclo) => {
              if (ciclo.id === state.cicloAtivoId) {
                return { ...ciclo, finishedDate: new Date() }
              } else {
                return ciclo
              }
            }),
            cicloAtivoId: null,
          }
        default:
          return state
      }
    },
    {
      ciclos: [],
      cicloAtivoId: null,
    },
  )

  const [totalSegundosPassados, setTotalSegundosPassados] = useState(0)

  const { ciclos, cicloAtivoId } = ciclosState
  const cicloAtivo = ciclos.find((ciclo) => ciclo.id === cicloAtivoId)

  function setSegundosPassados(seconds: number) {
    setTotalSegundosPassados(seconds)
  }

  function markCurrentCicloAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        cicloAtivoId,
      },
    })
  }

  function createNewCiclo(data: CreateCicloData) {
    const novoCiclo: Ciclo = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: 'ADD_NEW_CICLO',
      payload: {
        novoCiclo,
      },
    })
    setTotalSegundosPassados(0)
  }

  function interruptedCurrentCiclo() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        cicloAtivoId,
      },
    })
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
