import { produce } from 'immer'

import { ActionTypes } from './actions'

export interface Ciclo {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CiclosState {
  ciclos: Ciclo[]
  cicloAtivoId: string | null
}

export function ciclosReducers(state: CiclosState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CICLO:
      // return {
      //   ...state,
      //   ciclos: [...state.ciclos, action.payload.novoCiclo],
      //   cicloAtivoId: action.payload.novoCiclo.id,
      // }
      return produce(state, (draft) => {
        draft.ciclos.push(action.payload.novoCiclo)
        draft.cicloAtivoId = action.payload.novoCiclo.id
      })
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      // return {
      //   ...state,
      //   ciclos: state.ciclos.map((ciclo) => {
      //     if (ciclo.id === state.cicloAtivoId) {
      //       return { ...ciclo, interruptedDate: new Date() }
      //     } else {
      //       return ciclo
      //     }
      //   }),
      //   cicloAtivoId: null,
      // }
      const currentCicloIndex = state.ciclos.findIndex((ciclo) => {
        return ciclo.id === state.cicloAtivoId
      })

      if (currentCicloIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.cicloAtivoId = null
        draft.ciclos[currentCicloIndex].interruptedDate = new Date()
      })
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      //   return {
      //     ...state,
      //     ciclos: state.ciclos.map((ciclo) => {
      //       if (ciclo.id === state.cicloAtivoId) {
      //         return { ...ciclo, finishedDate: new Date() }
      //       } else {
      //         return ciclo
      //       }
      //     }),
      //     cicloAtivoId: null,
      //   }

      const currentCicloIndex = state.ciclos.findIndex((ciclo) => {
        return ciclo.id === state.cicloAtivoId
      })

      if (currentCicloIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.cicloAtivoId = null
        draft.ciclos[currentCicloIndex].finishedDate = new Date()
      })
    }
    default:
      return state
  }
}
