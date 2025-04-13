import { logger } from "./logger"

interface TournamentEntry {
    size?: 4 | 5 | 6;
    isGoalsFilled: boolean;
    isDataFilled: boolean;
    stats: {
        a: Stat[];
        b: Stat[];
    }
}

interface Stat {
    player: String | null;
    type: "goal" | "assist" | "yellow" | "2yellow" | "red" | "pgoal" | "nogoal" | "autogoal" | "keeperskip";
    time: number;
}

const hasParams = (url: URL, mode: String | null, action: String | null): boolean => {
    if (url.searchParams == null) return false;
    if (!url.searchParams.has('tournament_id')) return false;
    if (mode) if (!url.searchParams.has('mode') || url.searchParams.get('mode') != mode) return false;
    if (action) if (!url.searchParams.has('action') || url.searchParams.get('action') != action) return false;
    if (document.body.querySelector('#rt-maintop') == null) return false;
    return true;
}

const getTeams = () => {
    if (document.body.querySelectorAll(".rt-joomla-table").length === 0) return null
    return [document.body.querySelectorAll(".rt-joomla-table")[1]!, document.body.querySelectorAll(".rt-joomla-table")[3]!]
}

const readTournament = () => {
    // const url = new URL(window.location.href)
    logger.info("Считывание данных турнира...")
    const teams = getTeams()
    if (teams === null) return
    teams.forEach((team, i) => {
        console.log(team)
        console.log(team.querySelector("span.demo-title")!.textContent!.split(":")[0])
    })
}

const setCheckboxes = (size: 4 | 5 | 6) => {
    const teams = getTeams()
    if (teams === null) return
    teams.forEach((team, ii) => {
        team.querySelectorAll("tr[class]").forEach((player, i) => {
            if (i === 0) {
                if (!player.querySelectorAll("td")[3].querySelector("input")?.checked) player.querySelectorAll("td")[3].querySelector("input")?.click()
            }
            if (i < size) {
                if (!player.querySelectorAll("td")[0].querySelector("input")?.checked) player.querySelectorAll("td")[0].querySelector("input")?.click()
                if (!player.querySelectorAll("td")[2].querySelector("input")?.checked) player.querySelectorAll("td")[2].querySelector("input")?.click()
            }
        })
    })
}

const getPlayers = () => {
    const players: { a: Object[], b: Object[] } = {
        a: [],
        b: []
    }
    const teams = getTeams()
    teams!.forEach((team, i) => {
        team.querySelectorAll("tr[class]").forEach((player) => {
            players[i === 0 ? "a" : "b"].push(player)
        })
    })
    return players;
}

const getPlayer = (name: String): HTMLElement | null => {
    const players = document.querySelectorAll(".rt-joomla-table tr[class] td:nth-child(2) a")
    for (const player of <any>players) {
        if ((<HTMLElement>player).innerText.toLowerCase() === name.toLowerCase()) {
            return player.parentElement!.parentElement!;
        }
    }
    return null;
}

const getPlayerData = (player: HTMLElement) => {
    const data = player.querySelectorAll("td .inputbox");
    return {
        name: (<HTMLElement>player.querySelector("td:nth-child(2) a")!).innerText,
        role: (<HTMLElement>player.querySelector("td:nth-child(5) a")!).innerText,
        number: Number((<HTMLElement>player.querySelector("td:nth-child(2) a")!).innerText.replace(/\D+/g, "").replace(/\b0+\B/g, "")),
        refs: {
            playing: <HTMLInputElement>data[0],
            primary: <HTMLInputElement>data[1],
            keeper: <HTMLInputElement>data[2],
            goals: <HTMLInputElement>data[3],
            assists: <HTMLInputElement>data[4],
            pgoals: <HTMLInputElement>data[5],
            nogoals: <HTMLInputElement>data[6],
            autogoals: <HTMLInputElement>data[7],
            keeperskip: <HTMLInputElement>data[8],
            yellow: <HTMLInputElement>data[9],
            doubleyellow: <HTMLInputElement>data[10],
            red: <HTMLInputElement>data[11],
        }
    };
}

const getPlayerNames = () => {
    const players = getPlayers()
    const names = <{ a: String[], b: String[] }>{
        a: [],
        b: [],
    }
    Object.keys(players).forEach((p, i) => {
        players[i === 0 ? 'a' : 'b'].forEach((player) => {
            names[i === 0 ? 'a' : 'b'].push((<HTMLElement>(<HTMLElement>player).querySelector("td:nth-child(2) a")).innerText)
        })
    })
    return names;
}

const applyStats = (tournament: TournamentEntry) => {
    for (const key in tournament.stats) {
        for (const stat of tournament.stats[key === 'a' ? 'a' : 'b']) {
            if (stat.player === null) return;
            const player = getPlayer(stat.player);
            if (player === null) return;
            const data = getPlayerData(player);
            console.log(data);
            if (!data.refs.playing.checked) data.refs.playing.click();
            switch (stat.type) {
                case 'goal':
                    data.refs.goals.value = String(Number(data.refs.goals.value) + 1)
                    break;
                case 'assist':
                    data.refs.assists.value = String(Number(data.refs.assists.value) + 1)
                    break;
                case 'pgoal':
                    data.refs.pgoals.value = String(Number(data.refs.pgoals.value) + 1)
                    break;
                case 'nogoal':
                    data.refs.nogoals.value = String(Number(data.refs.nogoals.value) + 1)
                    break;
                case 'autogoal':
                    data.refs.autogoals.value = String(Number(data.refs.autogoals.value) + 1)
                    break;
                case 'keeperskip':
                    data.refs.keeperskip.value = String(Number(data.refs.keeperskip.value) + 1)
                    break;
                case 'yellow':
                    if (!data.refs.yellow.checked) data.refs.yellow.click();
                    break;
                case '2yellow':
                    if (!data.refs.yellow.checked) data.refs.yellow.click();
                    if (!data.refs.doubleyellow.checked) data.refs.doubleyellow.click();
                    break;
                case 'red':
                    if (!data.refs.red.checked) data.refs.red.click();
                    break;
            }
        }
    }
}

const applyTimings = (stats: { a: Stat[]; b: Stat[] }) => {
    const sections: Array<any> = []
    let pos = 0;
    document.querySelectorAll(".rt-article")[1].querySelectorAll("hr, b, input, select").forEach((point: any, i) => {
        if (i !== 0) {
            if (i % 4 === 0) {
                pos++;
            }
        }
        if (!sections[pos]) sections[pos] = [];
        sections[pos].push(point);
    })

    const { a, b } = JSON.parse(JSON.stringify(stats))
    const statsArr: any = [...a, ...b];

    for (const section of sections) {
        for (let stat of statsArr) {
            if (!stat.added) {
                const sectionPlayer = section[1].innerText.toLowerCase().trim();
                const statPlayer = stat.player.toLowerCase().trim();
                if (sectionPlayer == statPlayer) {
                    if (section[2].value == '') {
                        section[2].value = stat.time.toString();
                        stat.added = true
                    }
                }
            }
        }
    }
}

const onProtocolSave = (callback: () => void) => {
    document.body.querySelector("tr #toolbar-save a")?.addEventListener("click", () => {
        callback();
    })
}

export {
    hasParams,
    getTeams,
    readTournament,
    setCheckboxes,
    getPlayer,
    getPlayers,
    getPlayerNames,
    getPlayerData,
    applyStats,
    applyTimings,
    onProtocolSave,
};

export type { TournamentEntry, Stat };
