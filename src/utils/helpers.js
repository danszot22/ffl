import {
  leagueSettingsLoader,
  teamLoader,
  userTeamLoader,
} from "../api/graphql";
import {
  setLeague,
  setTeam,
  setUser,
  setUserToken,
} from "../contexts/FantasyTeamContext";

const dollarFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
});

export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const playerStatuses = [
  "IRDTR",
  "IR",
  "PUP",
  "Suspended",
  "Probable",
  "Questionable",
  "Doubtful",
  "NonFootball",
  "Out",
  "Unknown",
  "Covid",
  "Holdout",
  "Retired",
];
export const playerStatusCodes = [
  "IRDTR",
  "IR",
  "PUP",
  "Susp",
  "Prob",
  "Q",
  "D",
  "NonFootball",
  "Out",
  "Unknown",
  "Covid",
  "Holdout",
  "Retired",
];
export const tradeStatuses = [
  "Proposed",
  "Accepted",
  "Rejected",
  "Approved",
  "Denied",
  "Completed",
  "Expired",
];

export function convertDateToLocal(date) {
  const gameDate = new Date(date);
  // const offset = -gameDate.getTimezoneOffset();
  // const gameDateLocal = new Date(gameDate.getTime() + offset * 60000);
  // console.log(gameDate, offset, gameDateLocal);
  return gameDate;
}

export function formatPercent(percentage) {
  return isNaN(percentage)
    ? percentFormatter.format(0)
    : percentFormatter.format(percentage);
}

export function formatDollars(amount) {
  return isNaN(amount)
    ? dollarFormatter.format(0)
    : dollarFormatter.format(amount);
}

export function formatPlayerName(name, position) {
  if (!name) return " ";

  const nameParts = name.split(",");
  if (position.startsWith("TM")) return nameParts[0];
  return nameParts[1].trim().charAt(0) + "." + nameParts[0];
}

export function formatPlayerFullName(name) {
  const nameParts = name.split(",");
  return nameParts[1].trim() + " " + nameParts[0];
}

export function formatFantasyTeamName(team, excludeTeamName) {
  return excludeTeamName
    ? team?.OwnerName
    : `${team?.TeamName} (${team?.OwnerName})`;
}

export function formatDateToMonthYear(dateToFormat) {
  const dateLocal = convertDateToLocal(dateToFormat);
  return dateLocal.getMonth() + 1 + "/" + dateLocal.getDate();
}

export function numberOfDaysSinceDate(sinceDate) {
  if (!sinceDate) return;
  const days = Math.round(
    (new Date().getTime() - convertDateToLocal(sinceDate).getTime()) /
      (1000 * 3600 * 24)
  );
  return days;
}

export function formatGameTime(nflGame) {
  if (nflGame?.NotPlayed) {
    const gameDateLocal = convertDateToLocal(nflGame.GameDate);

    const day = weekDays[gameDateLocal.getDay()];
    const hours = gameDateLocal
      .getHours()
      .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    const minutes = gameDateLocal
      .getMinutes()
      .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    const time = `${hours > 12 ? hours - 12 : hours}:${minutes}`;
    return day + ". " + time;
  } else {
    return " ";
  }
}

export function formatGameInfo(nflTeamId, nflGame) {
  return nflGame?.HomeTeam
    ? `${formatGameTime(nflGame)} ${formatScore(
        nflTeamId,
        nflGame
      )} ${formatQuarter(nflGame)}`
    : " ";
}

export function formatScore(nflTeamId, nflGame) {
  const opponent =
    nflTeamId === nflGame?.HomeTeam?.NflTeamId
      ? `${nflGame?.AwayTeam?.DisplayCode}`
      : `@${nflGame?.HomeTeam?.DisplayCode}`;

  if (nflGame?.NotPlayed) {
    return opponent;
  } else {
    return nflTeamId === nflGame?.HomeTeam?.NflTeamId
      ? `${opponent} ${nflGame?.HomeScore}-${nflGame?.AwayScore} `
      : `${opponent} ${nflGame?.AwayScore}-${nflGame?.HomeScore} `;
  }
}

export function formatQuarter(nflGame) {
  return nflGame.Quarter == null
    ? ""
    : nflGame.Quarter.includes("1")
    ? nflGame.GameClock + " 1st"
    : nflGame.Quarter.includes("2")
    ? nflGame.GameClock + " 2nd"
    : nflGame.Quarter.includes("3")
    ? nflGame.GameClock + " 3rd"
    : nflGame.Quarter.includes("4")
    ? nflGame.GameClock + " 4th"
    : nflGame.Quarter.includes("5")
    ? nflGame.GameClock + " OT"
    : nflGame.Quarter.toLowerCase().startsWith("Final".toLowerCase())
    ? "Final"
    : nflGame.Quarter.toLowerCase().startsWith("Half".toLowerCase())
    ? "Half"
    : "";
}

export async function dispatchTokenData(dispatch, tokenPayLoad, token) {
  dispatch(setUserToken(token));

  const team = await teamLoader(+tokenPayLoad?.teamId);
  dispatch(setTeam(team));

  const league = await leagueSettingsLoader(+tokenPayLoad?.leagueId);
  dispatch(setLeague(league));

  const user = {
    userId: tokenPayLoad?.userId,
    userName: tokenPayLoad?.userName,
    firstName: tokenPayLoad?.firstName,
    lastName: tokenPayLoad?.lastName,
    isAdmin: tokenPayLoad?.role?.some((r) => r === "Administrator"),
    isCommissioner: [...tokenPayLoad?.commissionedLeagues]?.includes(
      tokenPayLoad?.leagueId
    ),
    isOwner: [...tokenPayLoad?.managedLeagues]?.includes(
      tokenPayLoad?.leagueId
    ),
    commissionedLeagues: [...tokenPayLoad?.commissionedLeagues],
    managedLeagues: [...tokenPayLoad?.managedLeagues],
  };
  dispatch(setUser(user));
}

export async function dispatchLeagueChange(dispatch, userId, leagueId) {
  const newTeam = await userTeamLoader(leagueId, userId);
  dispatch(setTeam(newTeam));

  const newLeague = await leagueSettingsLoader(leagueId);
  dispatch(setLeague(newLeague));
}
