/* eslint-disable no-console */
/* eslint-disable unicorn/prefer-dom-node-text-content */
import type { Stat } from '@/types/stat'
import type { TournamentEntry } from '@/types/tournament'
import { getPlayer, getPlayerData } from '@/modules/player'
import { getTeams } from '@/modules/team'
import { logger } from '@/utils/logger'
import { $, $all } from '@/utils/selector'

export function readTournament() {
  // const url = new URL(window.location.href)
  logger.info('Считывание данных турнира...')
  const teams = getTeams()
  if (teams === null)
    return
  teams.forEach((team, _i) => {
    console.log(team)
    console.log($('span.demo-title', team)!.textContent!.split(':')[0])
  })
}

export function applyStats(tournament: TournamentEntry) {
  for (const key in tournament.stats) {
    for (const stat of tournament.stats[key === 'a' ? 'a' : 'b']) {
      if (stat.player === null)
        return
      const player = getPlayer(stat.player)
      if (player === null)
        return
      const data = getPlayerData(player)
      console.log(data)
      if (!data.refs.playing.checked)
        data.refs.playing.click()
      switch (stat.type) {
        case 'goal':
          data.refs.goals.value = String(Number(data.refs.goals.value) + 1)
          break
        case 'assist':
          data.refs.assists.value = String(Number(data.refs.assists.value) + 1)
          break
        case 'pgoal':
          data.refs.pgoals.value = String(Number(data.refs.pgoals.value) + 1)
          break
        case 'nogoal':
          data.refs.nogoals.value = String(Number(data.refs.nogoals.value) + 1)
          break
        case 'autogoal':
          data.refs.autogoals.value = String(Number(data.refs.autogoals.value) + 1)
          break
        case 'keeperskip':
          data.refs.keeperskip.value = String(Number(data.refs.keeperskip.value) + 1)
          break
        case 'yellow':
          if (!data.refs.yellow.checked)
            data.refs.yellow.click()
          break
        case '2yellow':
          if (!data.refs.yellow.checked)
            data.refs.yellow.click()
          if (!data.refs.doubleyellow.checked)
            data.refs.doubleyellow.click()
          break
        case 'red':
          if (!data.refs.red.checked)
            data.refs.red.click()
          break
      }
    }
  }
}

export function applyTimings(stats: { a: Stat[], b: Stat[] }) {
  const sections: Array<any> = []
  let pos = 0
  $all('hr, b, input, select', $all('.rt-article')[1]).forEach((point: any, i) => {
    if (i !== 0) {
      if (i % 4 === 0) {
        pos++
      }
    }
    if (!sections[pos])
      sections[pos] = []
    sections[pos].push(point)
  })

  const { a, b } = JSON.parse(JSON.stringify(stats))
  const statsArr: any = [...a, ...b]

  for (const section of sections) {
    for (const stat of statsArr) {
      if (!stat.added) {
        const sectionPlayer = section[1].innerText.toLowerCase().trim()
        const statPlayer = stat.player.toLowerCase().trim()
        if (sectionPlayer === statPlayer) {
          if (section[2].value === '') {
            section[2].value = stat.time.toString()
            stat.added = true
          }
        }
      }
    }
  }
}

export function setCheckboxes(size: 4 | 5 | 6) {
  const teams = getTeams()
  if (teams === null)
    return
  teams.forEach((team) => {
    $all('tr[class]', team).forEach((player, i) => {
      const playerTd = $all('td', player)
      if (i === 0) {
        if (!$<HTMLInputElement>('input', playerTd[3])?.checked)
          $<HTMLInputElement>('input', $all('td', player)[3])?.click()
      }
      if (i < size) {
        const [td0, td2] = [$<HTMLInputElement>('input', playerTd[0]), $<HTMLInputElement>('input', playerTd[2])]
        if (!td0?.checked)
          $<HTMLInputElement>('input', $all('td', player)[0])?.click()
        if (!td2?.checked)
          $<HTMLInputElement>('input', $all('td', player)[2])?.click()
      }
    })
  })
}
