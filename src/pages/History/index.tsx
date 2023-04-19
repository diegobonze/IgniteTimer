import { useContext } from 'react'
import { formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { HisitoryList, HistoryContainer, Status } from './styles'
import { CiclosContext } from '../../contexts/CiclosContext'

export function History() {
  const { ciclos } = useContext(CiclosContext)

  return (
    <HistoryContainer>
      <h1>Meu Histórico</h1>
      <HisitoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ciclos.map((ciclo) => {
              return (
                <tr key={ciclo.id}>
                  <td>{ciclo.task}</td>
                  <td>{ciclo.minutesAmount} minutos</td>
                  <td>
                    {formatDistanceToNow(ciclo.startDate, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td>
                    {ciclo.finishedDate && (
                      <Status statusColor="green">Concluído</Status>
                    )}

                    {ciclo.interruptedDate && (
                      <Status statusColor="red">Interrompido</Status>
                    )}

                    {!ciclo.finishedDate && !ciclo.interruptedDate && (
                      <Status statusColor="yellow">Andamento</Status>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HisitoryList>
    </HistoryContainer>
  )
}
