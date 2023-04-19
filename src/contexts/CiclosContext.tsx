import { ReactNode, createContext, useState } from 'react'

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

export function CiclosContextProvider({
  children,
}: CiclosContextProviderProps) {
  const [ciclos, setCiclos] = useState<Ciclo[]>([])
  const [cicloAtivoId, setCicloAtivoId] = useState<string | null>(null)
  const [totalSegundosPassados, setTotalSegundosPassados] = useState(0)

  const cicloAtivo = ciclos.find((ciclo) => ciclo.id === cicloAtivoId)

  function setSegundosPassados(seconds: number) {
    setTotalSegundosPassados(seconds)
  }

  function markCurrentCicloAsFinished() {
    setCiclos((state) =>
      state.map((ciclo) => {
        if (ciclo.id === cicloAtivoId) {
          return { ...ciclo, finishedDate: new Date() }
        } else {
          return ciclo
        }
      }),
    )
  }

  function createNewCiclo(data: CreateCicloData) {
    const novoCiclo: Ciclo = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCiclos((state) => [...state, novoCiclo])
    setCicloAtivoId(novoCiclo.id)
    setTotalSegundosPassados(0)
  }

  function interruptedCurrentCiclo() {
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
