import { convertDateToLocal } from "./helpers";

export function mapSeasonPoints(data) {
  data.sort((a, b) => b.PointTotal - a.PointTotal);

  let rank = 0;
  let prevPoints = 0;
  const points = data.map((team) => {
    rank++;
    team = {
      ...team,
      rank: prevPoints !== team.PointTotal ? rank : "-",
    };
    prevPoints = team.PointTotal;
    return team;
  });

  return points;
}

export function mapSeasonRecords(data) {
  data.sort((a, b) => b.Wins - a.Wins || b.DivisionWins - a.DivisionWins);

  let divisionMap = {};

  data?.forEach((record) => {
    if (!divisionMap[record.Division]) {
      divisionMap[record.Division] = {
        key: record.Division,
        records: [],
      };
    }
    divisionMap[record.Division].records.push(record);
  });

  const divisions = Object.values(divisionMap).map((division) => division);
  divisions.sort((a, b) => a.key.localeCompare(b.key));

  return divisions;
}

export function mapScoring(data) {
  let rank = 0;
  let prevPoints = 0;
  const points = data.map((team) => {
    rank++;
    team = {
      ...team,
      rank: prevPoints !== team.total ? rank : "-",
    };
    prevPoints = team.total;
    return team;
  });
  return points;
}

export const statisticalCategory = [
  "PassYds",
  "PassTds",
  "PassInts",
  "RushYds",
  "RushTds",
  "RecYds",
  "RecTds",
  "FGoal",
  "FgYds",
  "XPs",
  "Tackles",
  "SoloTackles",
  "Sacks",
  "DefInts",
  "DefTds",
  "Points",
  "AssistedTackles",
];

export function mapCategoryScoring(data) {
  let subCategoryMap = {};

  data?.forEach((pointVersion) => {
    pointVersion.FantasyPoint.items?.forEach((fantasyPoint) => {
      if (!subCategoryMap[fantasyPoint.StatisticalCategory]) {
        subCategoryMap[fantasyPoint.StatisticalCategory] = {
          key: fantasyPoint.StatisticalCategory,
          title: statisticalCategory[fantasyPoint.StatisticalCategory],
          teamStatistics: [],
        };
      }
      const index = subCategoryMap[
        fantasyPoint.StatisticalCategory
      ].teamStatistics.findIndex((teamStatistic) => {
        return teamStatistic.TeamId === fantasyPoint.TeamId;
      });
      if (index < 0) {
        subCategoryMap[fantasyPoint.StatisticalCategory]?.teamStatistics?.push({
          PointTotal: !pointVersion.Projected ? fantasyPoint.PointTotal : 0,
          BonusTotal: !pointVersion.Projected ? fantasyPoint.BonusTotal : 0,
          StatisticalTotal: !pointVersion.Projected
            ? fantasyPoint.StatisticalTotal
            : 0,
          ProjStatisticalTotal: pointVersion.Projected
            ? fantasyPoint.StatisticalTotal
            : 0,
          Team: { ...fantasyPoint.Team, TeamId: fantasyPoint.TeamId },
          TeamId: fantasyPoint.TeamId,
          Bench:
            fantasyPoint.StarterOrBench === 1
              ? mapPlayerCategoryTotal(
                  [],
                  pointVersion.Projected,
                  fantasyPoint.PlayerStatistic.items
                )
              : [],
          Starters:
            fantasyPoint.StarterOrBench === 0
              ? mapPlayerCategoryTotal(
                  [],
                  pointVersion.Projected,
                  fantasyPoint.PlayerStatistic.items
                )
              : [],
        });
      } else {
        const previousStatistics =
          subCategoryMap[fantasyPoint.StatisticalCategory].teamStatistics[
            index
          ];
        subCategoryMap[fantasyPoint.StatisticalCategory].teamStatistics[index] =
          {
            ...previousStatistics,
            PointTotal:
              fantasyPoint.StarterOrBench === 0 && !pointVersion.Projected
                ? fantasyPoint.PointTotal
                : previousStatistics.PointTotal,
            BonusTotal:
              fantasyPoint.StarterOrBench === 0 && !pointVersion.Projected
                ? fantasyPoint.BonusTotal
                : previousStatistics.BonusTotal,
            StatisticalTotal:
              fantasyPoint.StarterOrBench === 0 && !pointVersion.Projected
                ? fantasyPoint.StatisticalTotal
                : previousStatistics.StatisticalTotal,
            ProjStatisticalTotal:
              fantasyPoint.StarterOrBench === 0 && pointVersion.Projected
                ? fantasyPoint.StatisticalTotal
                : previousStatistics.StatisticalTotal,
            Bench:
              fantasyPoint.StarterOrBench === 1
                ? mapPlayerCategoryTotal(
                    previousStatistics.Bench,
                    pointVersion.Projected,
                    fantasyPoint.PlayerStatistic.items
                  )
                : previousStatistics.Bench,
            Starters:
              fantasyPoint.StarterOrBench === 0
                ? mapPlayerCategoryTotal(
                    previousStatistics.Starters,
                    pointVersion.Projected,
                    fantasyPoint.PlayerStatistic.items
                  )
                : previousStatistics.Starters,
          };
      }
    });
  });
  Object.values(subCategoryMap).forEach((category) => {
    category.teamStatistics.sort(
      (a, b) =>
        b.PointTotal - a.PointTotal ||
        b.BonusTotal - a.BonusTotal ||
        b.StatisticalTotal - a.StatisticalTotal ||
        b.ProjStatisticalTotal - a.ProjStatisticalTotal
    );
    Object.values(category.teamStatistics).forEach((teamStatistic) => {
      teamStatistic.Starters.sort(
        (a, b) => b.Total - a.Total || b.ProjTotal - a.ProjTotal
      );
      teamStatistic.Bench.sort(
        (a, b) => b.Total - a.Total || b.ProjTotal - a.ProjTotal
      );
    });
  });

  return subCategoryMap;
}

export function mapSeasonCategoryScoring(data) {
  let subCategoryMap = {};

  data?.forEach((pointVersion) => {
    pointVersion.FantasyPoint.items?.forEach((fantasyPoint) => {
      if (!subCategoryMap[fantasyPoint.StatisticalCategory]) {
        subCategoryMap[fantasyPoint.StatisticalCategory] = {
          key: fantasyPoint.StatisticalCategory,
          title: statisticalCategory[fantasyPoint.StatisticalCategory],
          teamStatistics: [],
        };
      }
      const index = subCategoryMap[
        fantasyPoint.StatisticalCategory
      ].teamStatistics.findIndex((teamStatistic) => {
        return teamStatistic.TeamId === fantasyPoint.TeamId;
      });
      if (index < 0) {
        subCategoryMap[fantasyPoint.StatisticalCategory]?.teamStatistics?.push({
          PointTotal: fantasyPoint.PointTotal,
          BonusTotal: fantasyPoint.BonusTotal,
          StatisticalTotal:
            fantasyPoint.StarterOrBench === 0
              ? fantasyPoint.StatisticalTotal
              : 0,
          Team: { ...fantasyPoint.Team },
          TeamId: fantasyPoint.TeamId,
          Starters:
            fantasyPoint.StarterOrBench === 0
              ? mapPlayerSeasonCategoryTotal(
                  {},
                  fantasyPoint.PlayerStatistic.items,
                  fantasyPoint.StatisticalCategory,
                  fantasyPoint.TeamId
                )
              : {},
        });
      } else {
        const previousStatistics =
          subCategoryMap[fantasyPoint.StatisticalCategory].teamStatistics[
            index
          ];
        subCategoryMap[fantasyPoint.StatisticalCategory].teamStatistics[index] =
          {
            ...previousStatistics,
            PointTotal:
              fantasyPoint.StarterOrBench === 0
                ? fantasyPoint.PointTotal + previousStatistics.PointTotal
                : previousStatistics.PointTotal,
            BonusTotal:
              fantasyPoint.StarterOrBench === 0
                ? fantasyPoint.BonusTotal + previousStatistics.BonusTotal
                : previousStatistics.BonusTotal,
            StatisticalTotal:
              fantasyPoint.StarterOrBench === 0
                ? fantasyPoint.StatisticalTotal +
                  previousStatistics.StatisticalTotal
                : previousStatistics.StatisticalTotal,
            Starters:
              fantasyPoint.StarterOrBench === 0
                ? mapPlayerSeasonCategoryTotal(
                    previousStatistics.Starters,
                    fantasyPoint.PlayerStatistic.items,
                    fantasyPoint.StatisticalCategory,
                    fantasyPoint.TeamId
                  )
                : previousStatistics.Starters,
          };
      }
    });
  });
  Object.values(subCategoryMap).forEach((category) => {
    category.teamStatistics.sort(
      (a, b) =>
        b.PointTotal - a.PointTotal ||
        b.BonusTotal - a.BonusTotal ||
        b.StatisticalTotal - a.StatisticalTotal
    );

    Object.values(category.teamStatistics).forEach((teamStatistic) => {
      teamStatistic.Starters = Object.values(teamStatistic.Starters).map(
        (starter) => starter
      );
      teamStatistic.Starters.sort((a, b) => b.Total - a.Total);
    });
  });

  return subCategoryMap;
}

const mapPlayerCategoryTotal = (prevStatistics, projected, newStatistics) => {
  return newStatistics.map((newStatistic) => {
    const index = prevStatistics.findIndex((prevStatistic) => {
      return prevStatistic.PlayerId === newStatistic.PlayerId;
    });

    const playerStatistic = {
      ...prevStatistics[index],
      PlayerId: newStatistic.PlayerId,
      Player: { ...newStatistic.Player },
      NflGame: {
        ...mapNflGame(newStatistic.PlayerStatisticVersion.NflGame),
      },
      [projected ? "ProjTotal" : "Total"]: newStatistic.Total,
    };
    return playerStatistic;
  });
};

const mapPlayerSeasonCategoryTotal = (prevStatistics, newStatistics) => {
  newStatistics.forEach((newStatistic) => {
    if (!prevStatistics[newStatistic.PlayerId]) {
      prevStatistics[newStatistic.PlayerId] = {
        PlayerId: newStatistic.PlayerId,
        Player: { ...newStatistic.Player },
        Total: 0,
      };
    }
    prevStatistics[newStatistic.PlayerId].Total += newStatistic.Total;
  });
  return prevStatistics;
};

const mapNflGame = (nflGame) => {
  const gameDateLocal = convertDateToLocal(nflGame?.GameDate);
  if (!nflGame) return;
  return {
    ...nflGame,
    Playing: new Date() > gameDateLocal && !nflGame.Final,
    NotPlayed: new Date() < gameDateLocal && !nflGame.Final,
  };
};

const mapPlayerStatistic = (
  statistics,
  projected,
  statisticalCategoryId,
  newStatistic,
  index
) => {
  const playerStatistic = {
    ...statistics[index],
    PlayerId: newStatistic.PlayerId,
    Player: { ...newStatistic.Player },
    NflGame: {
      ...mapNflGame(newStatistic.PlayerStatisticVersion.NflGame),
    },
    [projected
      ? "Proj" + statisticalCategory[statisticalCategoryId]
      : statisticalCategory[statisticalCategoryId]]: newStatistic.Total,
  };

  const result = statistics
    .filter((statistic) => {
      return statistic.PlayerId !== newStatistic.PlayerId;
    })
    .concat(playerStatistic);

  return result;
};

export function mapTeamScoringTotals(data, lineups, nflGames) {
  let teamTotalMap = {};
  let version = {};
  data?.forEach((pointVersion) => {
    version = {
      complete: !pointVersion.Projected && pointVersion.Complete,
      createdDate: pointVersion.CreateDate,
    };

    pointVersion.FantasyPoint.items?.forEach((fantasyPoint) => {
      if (!teamTotalMap[fantasyPoint.TeamId]) {
        teamTotalMap[fantasyPoint.TeamId] = {
          key: fantasyPoint.TeamId,
          team: { ...fantasyPoint.Team, TeamId: fantasyPoint.TeamId },
          total: 0,
          projectedTotal: 0,
          Starters: [],
          Bench: [],
        };
      }

      if (pointVersion.Projected === true) {
        teamTotalMap[fantasyPoint.TeamId].projectedTotal +=
          fantasyPoint.PointTotal + fantasyPoint.BonusTotal;
      } else {
        teamTotalMap[fantasyPoint.TeamId].total +=
          fantasyPoint.PointTotal + fantasyPoint.BonusTotal;
      }

      fantasyPoint.PlayerStatistic.items.forEach((newStatistic) => {
        if (fantasyPoint.StarterOrBench === 1) {
          const index = teamTotalMap[fantasyPoint.TeamId].Bench.findIndex(
            (existingStatistic) => {
              return existingStatistic.PlayerId === newStatistic.PlayerId;
            }
          );
          teamTotalMap[fantasyPoint.TeamId].Bench = mapPlayerStatistic(
            teamTotalMap[fantasyPoint.TeamId].Bench,
            pointVersion.Projected,
            fantasyPoint.StatisticalCategory,
            newStatistic,
            index
          );
        } else {
          const index = teamTotalMap[fantasyPoint.TeamId].Starters.findIndex(
            (existingStatistic) => {
              return existingStatistic.PlayerId === newStatistic.PlayerId;
            }
          );
          teamTotalMap[fantasyPoint.TeamId].Starters = mapPlayerStatistic(
            teamTotalMap[fantasyPoint.TeamId].Starters,
            pointVersion.Projected,
            fantasyPoint.StatisticalCategory,
            newStatistic,
            index
          );
        }
      });
    });
  });

  lineups?.forEach((teamLineup) => {
    const teamScore = Object.values(teamTotalMap).find((teamStatistic) => {
      return teamStatistic.key === teamLineup.Team.TeamId;
    });

    if (teamScore) {
      teamLineup?.LineupPlayer?.items?.forEach((lp) => {
        if (lp.Starter) {
          const player = teamScore.Starters.find((p) => {
            return (
              p.PlayerId === lp.RosterPlayer.PlayerId ||
              (((lp.RosterPlayer.Player.Position?.PositionCode?.startsWith(
                "TMQB"
              ) &&
                p.Player.Position.PositionCode === "QB") ||
                (lp.RosterPlayer.Player.Position?.PositionCode?.startsWith(
                  "TMPK"
                ) &&
                  p.Player.Position.PositionCode === "PK")) &&
                lp.RosterPlayer.Player.NflTeam?.NflTeamId ===
                  p.Player.NflTeam?.NflTeamId)
            );
          });
          if (!player) {
            const nflGame = nflGames.find((nflGame) => {
              return (
                nflGame.HomeTeam?.NflTeamId ===
                  lp.RosterPlayer.Player?.NflTeam?.NflTeamId ||
                nflGame.AwayTeam?.NflTeamId ===
                  lp.RosterPlayer.Player?.NflTeam?.NflTeamId
              );
            });
            const missingPlayer = {
              PlayerId: lp.RosterPlayer.PlayerId,
              Player: {
                ...lp.RosterPlayer.Player,
              },
              NflGame: {
                ...mapNflGame(nflGame),
              },
            };
            teamScore.Starters = teamScore.Starters.concat(missingPlayer);
          }
        } else {
          const player = teamScore.Bench.find((p) => {
            return (
              p.PlayerId === lp.RosterPlayer.PlayerId ||
              (((lp.RosterPlayer.Player.Position?.PositionCode?.startsWith(
                "TMQB"
              ) &&
                p.Player.Position.PositionCode === "QB") ||
                (lp.RosterPlayer.Player.Position?.PositionCode?.startsWith(
                  "TMPK"
                ) &&
                  p.Player.Position.PositionCode === "PK")) &&
                lp.RosterPlayer.Player.NflTeam?.NflTeamId ===
                  p.Player.NflTeam?.NflTeamId)
            );
          });
          if (!player) {
            const nflGame = nflGames.find((nflGame) => {
              return (
                nflGame.HomeTeam?.NflTeamId ===
                  lp.RosterPlayer.Player?.NflTeam?.NflTeamId ||
                nflGame.AwayTeam?.NflTeamId ===
                  lp.RosterPlayer.Player?.NflTeam?.NflTeamId
              );
            });
            const missingPlayer = {
              PlayerId: lp.RosterPlayer.PlayerId,
              Player: {
                ...lp.RosterPlayer.Player,
              },
              NflGame: {
                ...mapNflGame(nflGame),
              },
            };
            teamScore.Bench = teamScore.Bench.concat(missingPlayer);
          }
        }
      });
    }
  });

  Object.values(teamTotalMap).forEach((teamStatistic) => {
    teamStatistic.Starters.sort(
      (a, b) => a.Player.Position.PositionId - b.Player.Position.PositionId
    );
    teamStatistic.Bench.sort(
      (a, b) => a.Player.Position.PositionId - b.Player.Position.PositionId
    );
  });

  const totals = Object.values(teamTotalMap).map((category) => category);
  totals.sort(
    (a, b) => b.total - a.total || b.projectedTotal - a.projectedTotal
  );

  return {
    complete: version.complete,
    createdDate: convertDateToLocal(version.createdDate),
    totals: totals,
  };
}

export function mapToTeamList(data) {
  const league = data.leagueName;
  const teams = data.divisions.reduce((acc, row) => {
    return acc.concat(...row.teams);
  }, []);

  return {
    league,
    teams,
  };
}

export function mapFantasyGames(data) {
  let fantasyGameMap = {};
  data?.forEach((result) => {
    if (!fantasyGameMap[result.FantasyGame.FantasyGameId]) {
      fantasyGameMap[result.FantasyGame.FantasyGameId] = {
        ...result.FantasyGame,
        HomeTotal: 0,
        AwayTotal: 0,
        ProjectedAwayTotal: 0,
        ProjectedHomeTotal: 0,
      };
    }

    if (result.PointVersion.Projected === true) {
      fantasyGameMap[result.FantasyGame.FantasyGameId].ProjectedHomeTotal =
        result.HomePointTotal;
      fantasyGameMap[result.FantasyGame.FantasyGameId].ProjectedAwayTotal =
        result.AwayPointTotal;
    } else {
      fantasyGameMap[result.FantasyGame.FantasyGameId].HomeTotal =
        result.HomePointTotal;
      fantasyGameMap[result.FantasyGame.FantasyGameId].AwayTotal =
        result.AwayPointTotal;
    }
  });

  return Object.values(fantasyGameMap).map((game) => game);
}

export function mapToLineupList(data, scoringData, nflGames, team) {
  let lineupMap = {};

  data?.forEach((teamLineup) => {
    const teamScore = scoringData.totals.find((teamScore) => {
      return teamScore.key === teamLineup.Team.TeamId;
    });
    if (!lineupMap[teamLineup.Team.TeamId]) {
      lineupMap[teamLineup.Team.TeamId] = {
        key: teamLineup.Team.TeamId,
        team: {
          ...teamLineup.Team,
          score: teamScore.total,
          projectedScore: teamScore.projectedTotal,
          complete: scoringData.complete,
        },
        SubmitDateTime: teamLineup.SubmitDateTime,
        Starters: [],
        Bench: [],
      };
    }
    teamLineup.LineupPlayer.items.forEach((teamLineupPlayer) => {
      const nflGame = nflGames.find((nflGame) => {
        return (
          nflGame.HomeTeam?.NflTeamId ===
            teamLineupPlayer.RosterPlayer.Player?.NflTeam?.NflTeamId ||
          nflGame.AwayTeam?.NflTeamId ===
            teamLineupPlayer.RosterPlayer.Player?.NflTeam?.NflTeamId
        );
      });
      if (teamLineupPlayer.Starter) {
        const playerScore = teamScore.Starters.find((starter) => {
          return starter.PlayerId === teamLineupPlayer.RosterPlayer.PlayerId;
        });
        const player = {
          NflGame: { ...mapNflGame(nflGame) },
          ...teamLineupPlayer,
          ...playerScore,
        };
        lineupMap[teamLineup.Team.TeamId].Starters =
          lineupMap[teamLineup.Team.TeamId].Starters.concat(player);
      } else {
        const playerScore = teamScore.Bench.find((benchPlayer) => {
          return (
            benchPlayer.PlayerId === teamLineupPlayer.RosterPlayer.PlayerId
          );
        });
        const player = {
          NflGame: { ...mapNflGame(nflGame) },
          ...teamLineupPlayer,
          ...playerScore,
        };
        lineupMap[teamLineup.Team.TeamId].Bench =
          lineupMap[teamLineup.Team.TeamId].Bench.concat(player);
      }
    });
  });
  const lineupResult = Object.values(lineupMap).map((lineup) => lineup);
  lineupResult.sort((a, b) => {
    return (
      (a.team.TeamId === team ? 0 : 1) - (b.team.TeamId === team ? 0 : 1) ||
      new Date(b.SubmitDateTime) - new Date(a.SubmitDateTime)
    );
  });

  return lineupResult;
}

function mapPositionGroup(positionCode) {
  return ["S", "CB", "LB", "DE", "DT"].includes(positionCode)
    ? "Defense"
    : ["WR", "TE"].includes(positionCode)
    ? "Receivers"
    : ["TMQB", "QB"].includes(positionCode)
    ? "Quarterbacks"
    : ["TMPK", "PK"].includes(positionCode)
    ? "Kickers"
    : ["RB"].includes(positionCode)
    ? "Running Backs"
    : " ";
}

function mapLineupPlayer(lineupPlayer, playerScore, rosterPlayer, nflGame) {
  return {
    Starting: lineupPlayer?.Starter ? lineupPlayer?.Starter : false,
    ...playerScore,
    PlayerId: rosterPlayer.PlayerId,
    RosterPlayerId: rosterPlayer.RosterPlayerId,
    Player: {
      EspnPlayerId: rosterPlayer?.EspnPlayerId
        ? rosterPlayer?.EspnPlayerId
        : rosterPlayer?.Player?.EspnPlayerId,
      Name: rosterPlayer?.PlayerName
        ? rosterPlayer?.PlayerName
        : rosterPlayer?.Player?.Name,
      Position: {
        PositionId: rosterPlayer?.PositionId
          ? rosterPlayer?.PositionId
          : rosterPlayer?.Player?.Position?.PositionId,
        PositionCode: rosterPlayer?.PositionCode
          ? rosterPlayer?.PositionCode
          : rosterPlayer?.Player?.Position?.PositionCode,
        Group: mapPositionGroup(
          rosterPlayer?.PositionCode
            ? rosterPlayer?.PositionCode
            : rosterPlayer?.Player?.Position?.PositionCode
        ),
      },
      NflTeam: {
        NflTeamId: rosterPlayer?.NflTeamId
          ? rosterPlayer?.NflTeamId
          : rosterPlayer?.Player?.NflTeam?.NflTeamId,
        DisplayCode: rosterPlayer?.DisplayCode
          ? rosterPlayer?.DisplayCode
          : rosterPlayer?.Player?.NflTeam?.DisplayCode,
      },
      Status: {
        StatusCode: rosterPlayer.StatusCode,
        StatusDescription: rosterPlayer.StatusDescription,
      },
    },
    NflGame: {
      ...mapNflGame(nflGame),
    },
  };
}

function getLineupPlayerData(nflGames, rosterPlayer, lineup, teamScore) {
  const nflGame = nflGames?.find((nflGame) => {
    return (
      nflGame.HomeTeam?.NflTeamId === rosterPlayer.NflTeamId ||
      nflGame.AwayTeam?.NflTeamId === rosterPlayer.NflTeamId ||
      nflGame.HomeTeam?.NflTeamId ===
        rosterPlayer?.Player?.NflTeam?.NflTeamId ||
      nflGame.AwayTeam?.NflTeamId === rosterPlayer?.Player?.NflTeam?.NflTeamId
    );
  });
  const lineupPlayer = lineup?.LineupPlayer?.items?.find((lp) => {
    return lp.RosterPlayer?.PlayerId === rosterPlayer.PlayerId;
  });

  let playerScore = teamScore?.Starters?.find((starter) => {
    return starter.PlayerId === rosterPlayer.PlayerId;
  });

  if (!playerScore) {
    playerScore = teamScore?.Bench?.find((benchPlayer) => {
      return benchPlayer.PlayerId === rosterPlayer.PlayerId;
    });
  }

  return { nflGame, lineupPlayer, playerScore };
}

export function mapRosterToTeamLineup(roster, teamScore, nflGames, lineup) {
  let lineupMap = {};
  roster?.forEach((rosterPlayer) => {
    if (!lineupMap[rosterPlayer.TeamId]) {
      lineupMap[rosterPlayer.TeamId] = {
        key: rosterPlayer.TeamId,
        team: {
          TeamId: rosterPlayer.TeamId,
          TeamName: rosterPlayer.TeamName,
          OwnerName: rosterPlayer.OwnerName,
        },
        Players: [],
      };
    }
    const { nflGame, lineupPlayer, playerScore } = getLineupPlayerData(
      nflGames,
      rosterPlayer,
      lineup,
      teamScore
    );

    const player = mapLineupPlayer(
      lineupPlayer,
      playerScore,
      rosterPlayer,
      nflGame
    );
    lineupMap[rosterPlayer.TeamId].Players =
      lineupMap[rosterPlayer.TeamId].Players.concat(player);
  });

  lineup?.LineupPlayer?.items?.forEach((lp) => {
    if (lp.Starter) {
      const rosterPlayer = roster?.find((rp) => {
        return lp.RosterPlayer?.PlayerId === rp.PlayerId;
      });
      if (!rosterPlayer) {
        const { nflGame, playerScore } = getLineupPlayerData(
          nflGames,
          lp.RosterPlayer,
          lineup,
          teamScore
        );
        const player = mapLineupPlayer(
          lp,
          playerScore,
          lp.RosterPlayer,
          nflGame
        );
        if (
          player.Starting &&
          (player.NflGame.Playing || player.NflGame.Final)
        ) {
          if (roster[0]?.TeamId && lineupMap[roster[0]?.TeamId]?.Players) {
            lineupMap[roster[0]?.TeamId].Players =
              lineupMap[roster[0]?.TeamId]?.Players.concat(player);
          }
        }
      }
    }
  });
  const lineupResult = Object.values(lineupMap).map((lineup) => lineup);

  lineupResult[0]?.Players?.sort(
    (a, b) => a.Player.Position.PositionId - b.Player.Position.PositionId
  );
  return lineupResult[0];
}

export function mapLineupToTeamLineup(lineup, nflGames) {
  let lineupMap = {};
  lineup?.LineupPlayer?.items?.forEach((lineupPlayer) => {
    if (!lineupMap[lineup.Team.TeamId]) {
      lineupMap[lineup.Team.TeamId] = {
        key: lineup.Team.TeamId,
        team: {
          TeamId: lineup.Team.TeamId,
          TeamName: lineup.Team.TeamName,
          OwnerName: lineup.Team.OwnerName,
        },
        Players: [],
      };
    }
    const nflGame = nflGames?.find((nflGame) => {
      return (
        nflGame.HomeTeam?.NflTeamId ===
          lineupPlayer.RosterPlayer.Player.NflTeam.NflTeamId ||
        nflGame.AwayTeam?.NflTeamId ===
          lineupPlayer.RosterPlayer.Player.NflTeam.NflTeamId
      );
    });
    const player = {
      ...lineupPlayer.RosterPlayer,
      Starting: lineupPlayer.Starter,
      NflGame: {
        ...mapNflGame(nflGame),
      },
    };
    lineupMap[lineup.Team.TeamId].Players =
      lineupMap[lineup.Team.TeamId].Players.concat(player);
  });
  const lineupResult = Object.values(lineupMap).map((lineup) => lineup);

  return lineupResult[0];
}

export function mapToPlayerList(data, league) {
  const playerMap = data.map((player) => {
    const rosterPlayer = player.RosterPlayer?.items?.find((rosterPlayer) => {
      return (
        rosterPlayer?.Team?.LeagueId === league &&
        rosterPlayer.DeleteDate === null
      );
    });
    return {
      ...player,
      RosterPlayer: { ...rosterPlayer },
    };
  });
  return playerMap;
}

export function mapToRosterList(data, team) {
  let rosterMap = {};
  data?.forEach((rosterPlayer) => {
    if (!rosterMap[rosterPlayer.TeamId]) {
      rosterMap[rosterPlayer.TeamId] = {
        key: rosterPlayer.TeamId,
        team: {
          TeamId: rosterPlayer.TeamId,
          TeamName: rosterPlayer.TeamName,
          OwnerName: rosterPlayer.OwnerName,
        },
        Players: [],
      };
    }
    const player = {
      ...rosterPlayer,
      Group: mapPositionGroup(rosterPlayer.PositionCode),
    };
    rosterMap[rosterPlayer.TeamId].Players =
      rosterMap[rosterPlayer.TeamId].Players.concat(player);
  });
  const rosterResult = Object.values(rosterMap).map((roster) => roster);
  rosterResult.sort(
    (a, b) =>
      (a.team.TeamId === team ? 0 : 1) - (b.team.TeamId === team ? 0 : 1)
  );
  return rosterResult;
}

function mapGame(game) {
  let mappedGame = {
    FantasyGameId: game.FantasyGameId,
    Complete: false,
    HomeTeam: {
      ...game.HomeTeam,
      PointTotal: 0,
      ProjectedTotal: 0,
    },
    AwayTeam: {
      ...game.AwayTeam,
      PointTotal: 0,
      ProjectedTotal: 0,
    },
  };
  game.FantasyGameResult?.items?.forEach((gameResult) => {
    if (gameResult.PointVersion.Projected) {
      mappedGame.HomeTeam.ProjectedTotal = gameResult.HomePointTotal;
      mappedGame.AwayTeam.ProjectedTotal = gameResult.AwayPointTotal;
    } else {
      mappedGame.Complete = gameResult.PointVersion.Complete;
      mappedGame.HomeTeam.PointTotal = gameResult.HomePointTotal;
      mappedGame.AwayTeam.PointTotal = gameResult.AwayPointTotal;
    }
  });

  return mappedGame;
}

function mapTeamGame(game, team) {
  let mappedGame = {
    FantasyGameId: game.FantasyGameId,
    Complete: false,
    PointTotal: 0,
    ProjectedTotal: 0,
    Result: "",
  };
  if (game.HomeTeam.TeamId === team) {
    mappedGame = {
      ...mappedGame,
      Opponent: {
        ...game.AwayTeam,
        PointTotal: 0,
        ProjectedTotal: 0,
      },
    };
  } else {
    mappedGame = {
      ...mappedGame,
      Opponent: {
        ...game.HomeTeam,
        PointTotal: 0,
        ProjectedTotal: 0,
      },
    };
  }
  game.FantasyGameResult?.items?.forEach((gameResult) => {
    if (gameResult.PointVersion.Projected) {
      mappedGame.ProjectedTotal =
        game.HomeTeam.TeamId === team
          ? gameResult.HomePointTotal
          : gameResult.AwayPointTotal;
      mappedGame.Opponent.ProjectedTotal =
        game.HomeTeam.TeamId === team
          ? gameResult.AwayPointTotal
          : gameResult.HomePointTotal;
    } else {
      mappedGame.Complete = gameResult.PointVersion.Complete;
      mappedGame.PointTotal =
        game.HomeTeam.TeamId === team
          ? gameResult.HomePointTotal
          : gameResult.AwayPointTotal;
      mappedGame.Opponent.PointTotal =
        game.HomeTeam.TeamId === team
          ? gameResult.AwayPointTotal
          : gameResult.HomePointTotal;
      mappedGame.Result =
        game.HomeTeam.TeamId === team &&
        gameResult.AwayPointTotal > gameResult.HomePointTotal
          ? "L"
          : game.HomeTeam.TeamId === team &&
            gameResult.AwayPointTotal < gameResult.HomePointTotal
          ? "W"
          : game.HomeTeam.TeamId === team &&
            gameResult.AwayPointTotal === gameResult.HomePointTotal
          ? "T"
          : game.AwayTeam.TeamId === team &&
            gameResult.AwayPointTotal > gameResult.HomePointTotal
          ? "W"
          : game.AwayTeam.TeamId === team &&
            gameResult.AwayPointTotal < gameResult.HomePointTotal
          ? "L"
          : game.AwayTeam.TeamId === team &&
            gameResult.AwayPointTotal === gameResult.HomePointTotal
          ? "T"
          : " ";
    }
  });

  return mappedGame;
}

export function mapToGameList(data) {
  const gameMap = {};
  data?.forEach((game) => {
    if (!gameMap[game.Week]) {
      gameMap[game.Week] = {
        Week: game.Week,
        Games: [],
      };
    }
    const mappedGame = mapGame(game.FantasyGame.items[0]);
    gameMap[game.Week].Games = gameMap[game.Week].Games.concat(mappedGame);
  });
  return gameMap;
}

export function mapToTeamGameList(data, team) {
  const gameMap = {};
  let wins = 0;
  let losses = 0;
  let ties = 0;
  data?.forEach((game) => {
    if (!gameMap[game.Week]) {
      gameMap[game.Week] = {
        Week: game.Week,
        Game: {
          ...mapTeamGame(game.FantasyGame.items[0], team),
        },
        Wins: 0,
        Losses: 0,
        Ties: 0,
      };
      if (gameMap[game.Week].Game.Result === "W") wins++;
      if (gameMap[game.Week].Game.Result === "T") ties++;
      if (gameMap[game.Week].Game.Result === "L") losses++;
      gameMap[game.Week].Wins = wins;
      gameMap[game.Week].Losses = losses;
      gameMap[game.Week].Ties = ties;
    }
  });
  return gameMap;
}

export function mapTeamFinances(teamData, prizeData, transactionData) {
  const prizeTotals = prizeData?.reduce((acc, prize) => {
    acc[prize.TeamId] = (acc[prize.TeamId] || 0) + prize.PrizeAmount;
    return acc;
  }, {});

  const transactionTotals = transactionData?.reduce((acc, transaction) => {
    acc[transaction.RosterPlayerAdded.Team.TeamId] =
      (acc[transaction.RosterPlayerAdded.Team.TeamId] || 0) +
      transaction.TransactionFee;
    return acc;
  }, {});

  const finances = teamData.map((team) => {
    const mappedTeam = {
      ...team,
      Winnings: prizeTotals[team.TeamId] || 0,
      TransactionFees:
        (transactionTotals && transactionTotals[team.TeamId]) || 0,
      Balance:
        team.EntryFee +
        ((transactionTotals && transactionTotals[team.TeamId]) || 0) -
        team.FeesPaid -
        ((prizeTotals[team.TeamId] || 0) - team.WinningsPaid),
    };
    return mappedTeam;
  });

  return finances;
}

export function mapTeamPlayerDetails(data, gameData) {
  let playerMap = [];
  const gameMap = {};

  data?.forEach((playerHistory) => {
    //check if player already added
    const player = playerMap?.find(
      (p) => p.Player.PlayerId === playerHistory.Player.PlayerId
    );
    //don't add player twice
    if (!player) {
      playerMap = playerMap.concat(
        mapPlayerDetails(playerHistory.Player, gameData)
      );
    }
  });

  playerMap?.forEach((player) => {
    player.Statistics?.forEach((gameStatistics) => {
      const teamGame = gameData.find(
        (game) => game.NflGameId === gameStatistics.Game?.NflGameId
      );
      if (teamGame) {
        if (!gameMap[teamGame.NflGameId]) {
          gameMap[teamGame.NflGameId] = {
            Game: {
              ...gameStatistics.Game,
            },
            Players: [],
          };
        }
        const p = {
          Player: {
            PlayerId: player.Player.PlayerId,
            EspnPlayerId: player.Player.EspnPlayerId,
            Name: player.Player.Name,
            Position: { ...player.Player.Position },
            NflTeam: { ...player.Player.NflTeam },
          },
          ...gameStatistics,
        };
        if (
          p.PassYds ||
          p.PassInts ||
          p.PassTds ||
          p.RushYds ||
          p.XPs ||
          p.FgYds
        )
          gameMap[gameStatistics.Game?.NflGameId].Players =
            gameMap[gameStatistics.Game?.NflGameId].Players.concat(p);
      }
    });
  });

  gameData.forEach((game) => {
    if (!gameMap[game?.NflGameId]) {
      gameMap[game?.NflGameId] = {
        Game: {
          ...mapNflGame(game),
        },
        Players: [],
      };
    }
  });

  return gameMap;
}

export function mapPlayerDetails(data, allGameData) {
  const gameMap = {};
  let gameData = [];

  data?.PlayerHistory?.items.forEach(async (playerHistory) => {
    if (playerHistory?.NflTeamId) {
      const g = allGameData.filter(
        (game) =>
          (game.AwayTeam.NflTeamId === playerHistory?.NflTeamId ||
            game.HomeTeam.NflTeamId === playerHistory?.NflTeamId) &&
          game.GameDate > playerHistory?.FromDate &&
          game.GameDate < playerHistory?.ToDate
      );
      gameData.push(...g);
    }
  });

  data?.PlayerStatistic.items.forEach((playerStatistic) => {
    if (!gameMap[playerStatistic.PlayerStatisticVersion.NflGame?.NflGameId]) {
      const playerHistory = data?.PlayerHistory?.items.find(
        (historyItem) =>
          playerStatistic.PlayerStatisticVersion.NflGame?.GameDate >
            historyItem.FromDate &&
          playerStatistic.PlayerStatisticVersion.NflGame?.GameDate <
            historyItem.ToDate
      );
      gameMap[playerStatistic.PlayerStatisticVersion.NflGame?.NflGameId] = {
        Game: {
          ...mapNflGame(playerStatistic.PlayerStatisticVersion.NflGame),
          PlayerNflTeam: playerHistory?.NflTeam,
        },
      };
    }
    if (!playerStatistic.PlayerStatisticVersion.Projected) {
      gameMap[playerStatistic.PlayerStatisticVersion.NflGame?.NflGameId] = {
        ...gameMap[playerStatistic.PlayerStatisticVersion.NflGame?.NflGameId],
        [statisticalCategory[playerStatistic.StatisticalCategory]]:
          playerStatistic.Total,
      };
    }
  });
  gameData.forEach((game) => {
    if (!gameMap[game?.NflGameId]) {
      const playerHistory = data?.PlayerHistory?.items.find(
        (historyItem) =>
          game?.GameDate > historyItem.FromDate &&
          game?.GameDate < historyItem.ToDate
      );
      gameMap[game?.NflGameId] = {
        Game: {
          ...mapNflGame(game),
          PlayerNflTeam: playerHistory?.NflTeam,
        },
      };
    }
  });

  const playerMap = {
    Statistics: Object.values(gameMap).map((game) => game),
    Player: {
      PlayerId: data.PlayerId,
      EspnPlayerId: data.EspnPlayerId,
      Name: data.Name,
      Position: { ...data.Position },
      NflTeam: { ...data.NflTeam },
    },
  };
  return playerMap;
}
