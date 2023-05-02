import { Ciclo } from './reducer'

export enum ActionTypes {
  ADD_NEW_CICLO = 'ADD_NEW_CICLO',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export function addNewCycleAction(novoCiclo: Ciclo) {
  return {
    type: ActionTypes.ADD_NEW_CICLO,
    payload: {
      novoCiclo,
    },
  }
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
  }
}

export function interruptedCurrentCicloAction() {
  return {
    type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
  }
}
