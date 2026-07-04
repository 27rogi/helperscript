import { getTeams } from "@/modules/team"
import { $, $all } from "../utils/selector"

export const getPlayers = () => {
  const players: { a: HTMLElement[], b: HTMLElement[] } = {
    a: [],
    b: []
  }
  const teams = getTeams()
  teams!.forEach((team, i) => {
    $all("tr[class]", team).forEach((player) => {
      players[i === 0 ? "a" : "b"].push(player)
    })
  })
  return players;
}

export const getPlayer = (name: String): HTMLElement | null => {
  const players = $all(".rt-joomla-table tr[class] td:nth-child(2) a")
  for (const player of players) {
    if (player.innerText.toLowerCase() === name.toLowerCase()) {
      return player.parentElement!.parentElement!;
    }
  }
  return null;
}

export const getPlayerData = (player: HTMLElement) => {
  const data = $all("td .inputbox", player) as NodeListOf<HTMLInputElement>;
  return {
    name: $("td:nth-child(2) a", player)!.innerText,
    role: $("td:nth-child(5) a", player)!.innerText,
    number: Number($("td:nth-child(2) a", player)!.innerText.replace(/\D+/g, "").replace(/\b0+\B/g, "")),
    refs: {
      playing: data[0],
      primary: data[1],
      keeper: data[2],
      goals: data[3],
      assists: data[4],
      pgoals: data[5],
      nogoals: data[6],
      autogoals: data[7],
      keeperskip: data[8],
      yellow: data[9],
      doubleyellow: data[10],
      red: data[11],
    }
  };
}

export const getPlayerNames = () => {
  const players = getPlayers()
  const names = <{ a: String[], b: String[] }>{
    a: [],
    b: [],
  }
  Object.keys(players).forEach((_p, i) => {
    players[i === 0 ? 'a' : 'b'].forEach((player) => {
      names[i === 0 ? 'a' : 'b'].push($("td:nth-child(2) a", player)!.innerText)
    })
  })
  return names;
}