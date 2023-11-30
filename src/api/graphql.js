import { fflapi } from "./ffl";

export const seasonStandingsLoader = async (year, leagueId) => {
  const response = await postToApi(`{
        seasonStandings( filter: {and: [
                { Team :{ LeagueId: { eq: ${leagueId}} } }
                { Year: { eq: ${year} } }
            ] }) {
            items {
                Year
                TeamId
                Team {
                    TeamId
                    Division
                    TeamName
                    OwnerName
                }
                PointTotal
                Wins
                Losses
                Ties
                DivisionWins
                DivisionLosses
                DivisionTies
                PrizeTotal
            }
        }
    }`);
  return response.data.data?.seasonStandings?.items;
};

async function postToApi(query) {
  const options = {
    method: "POST",
    url: "/dab/graphql/",
    data: {
      query,
    },
  };
  return await fflapi.request(options).catch((error) => {
    return error?.response;
  });
}

function convertFilters(columnFilters, globalFilter, additionalFilter) {
  return columnFilters?.length > 0
    ? columnFilters.reduce((acc, column) => {
        const columnNames = column.id.split(".");
        let columnFilter = " ";
        for (const columnName of columnNames) {
          columnFilter += ` { ${columnName} :`;
        }
        columnFilter += ` { contains: "${column.value}"} `;
        for (var i = 0; i < columnNames.length; i++) {
          columnFilter += ` } `;
        }
        return `${acc} ${columnFilter}`;
      }, "filter: {  and: [" + additionalFilter) + " ]},"
    : additionalFilter
    ? "filter: {  and: [" + additionalFilter + " ]},"
    : " ";
}

function convertSorting(sorting) {
  return sorting?.length > 0
    ? sorting.reduce((acc, column) => {
        const columnNames = column.id.split(".");
        let columnSort = " ";
        for (const columnName of columnNames) {
          columnSort += ` { ${columnName} :`;
        }
        columnSort += column.desc ? " DESC " : " ASC ";
        for (var i = 0; i < columnNames.length; i++) {
          columnSort += ` } `;
        }
        return `${acc} ${columnSort}`;
      }, "orderBy: ")
    : " ";
}

export const userLoader = async (username) => {
  const response = await postToApi(`{
        users( filter: {UserName: { eq: "${username}" } }) {
          items {
            Id
            FirstName
            LastName
            FriendlyName
            Email_IR
            Email_Stats
            Address1
            Address2
            City
            State
            Zip
            Phone
            Email      
            PhoneNumber
            }
        }
    }`);
  return response.data.data.users?.items[0];
};

export const nflTeamsLoader = async () => {
  const response = await postToApi(`{
        nflTeams(  orderBy: { Name : ASC } ) {
          items {
                Name
                DisplayCode
          }
        }
      }`);
  return response.data.data.nflTeams.items.map((item) => item.Name);
};

export const nflGamesLoader = async (week) => {
  const response = await postToApi(`{
        nflGames( filter: {Week: { eq: ${week} } } ) {
            items {
                HomeScore
                HomeTeam {
                    NflTeamId
                    DisplayCode
                }
                AwayScore
                AwayTeam {
                    NflTeamId
                    DisplayCode
                }
                Quarter
                GameClock
                GameDate
                Final
                BoxScoreURL
            }
        }
    }`);
  return response.data.data?.nflGames?.items;
};
export const nflGamesForPlayerLoader = async (playerHistoryList) => {
  const games = [];

  playerHistoryList.forEach(async (playerHistory) => {
    if (playerHistory?.NflTeamId) {
      const g = await nflGamesInPeriodByTeamLoader(
        playerHistory?.NflTeamId,
        playerHistory?.FromDate,
        playerHistory?.ToDate
      );
      games.push(...g);
    }
  });

  return games;
};

const nflGamesInPeriodByTeamLoader = async (team, startDate, endDate) => {
  const response = await postToApi(`{
        nflGames( filter: {and: [{or: [
            { AwayTeam_NflTeamId: { eq: ${team} } } 
            { HomeTeam_NflTeamId: { eq: ${team} } } 
       ] }
           {GameDate: { gt: "${startDate}"} }
           {GameDate: { lt: "${endDate}"} }
       ]}
            ) {
            items {
                NflGameId
                GameDate
                Week
                HomeScore
                AwayScore
                AwayTeam {
                    NflTeamId
                    NflTeamCode
                    DisplayName
                    DisplayCode
                }
                HomeTeam {
                    NflTeamId
                    NflTeamCode
                    DisplayName
                    DisplayCode
                }
                BoxScoreURL
            }
        }
      }`);
  return response.data.data.nflGames.items;
};

export const scoringLoader = async (league, week) => {
  if (!Number.isInteger(league) || !Number.isInteger(week)) return [];
  const response = await postToApi(`{
            pointVersions ( filter: {and: [
                { LeagueId: { eq: ${league} } }
                { Week: { eq: ${week} } }
              { Active: { eq: true } }
            ] } orderBy: { Week : ASC } ) {
              items {
                    Complete
                    CreateDate
                    Projected
                    FantasyPoint (first: 1000) {
                        items { 
                            StatisticalCategory
                            PointTotal 
                            BonusTotal
                            StatisticalTotal
                            StarterOrBench
                            TeamId 
                            Team {
                                TeamName
                                OwnerName
                            }
                            PlayerStatistic {
                                items {
                                    PlayerId
                                    Total
                                    Player {
                                        Name
                                        Position {
                                            PositionCode
                                            PositionId
                                        }
                                        NflTeam {
                                            NflTeamId
                                        }
                                    }
                                    PlayerStatisticVersion {
                                        NflGame {
                                            HomeScore
                                            HomeTeam {
                                                NflTeamId
                                                DisplayCode
                                            }
                                            AwayScore
                                            AwayTeam {
                                                NflTeamId
                                                DisplayCode
                                            }
                                            Quarter
                                            GameClock
                                            GameDate
                                            Final
                                            BoxScoreURL
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
          }`);

  return response.data.data.pointVersions.items;
};

export const seasonScoringLoader = async (league) => {
  if (!Number.isInteger(league)) return [];
  const response = await postToApi(`{
            pointVersions ( filter: {and: [
                { LeagueId: { eq: ${league} } }
              { Active: { eq: true } }
              { Projected: { eq: false } }
            ] } orderBy: { Week : ASC } ) {
              items {
                    Complete
                    CreateDate
                    Projected
                    FantasyPoint (first: 1000) {
                        items { 
                            StatisticalCategory
                            PointTotal 
                            BonusTotal
                            StatisticalTotal
                            StarterOrBench
                            TeamId 
                            Team {
                                TeamName
                                OwnerName
                            }
                            PlayerStatistic {
                                items {
                                    PlayerId
                                    Total
                                    Player {
                                        Name
                                        Position {
                                            PositionCode
                                            PositionId
                                        }
                                        NflTeam {
                                            NflTeamId
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
          }`);

  return response.data.data.pointVersions.items;
};

export const teamsLoader = async (league) => {
  if (!Number.isInteger(league)) return [];
  const response = await postToApi(`{
        teams ( filter: {LeagueId: { eq: ${league} } }   orderBy: { Division : ASC } ) {
          items {
                LeagueId
                TeamId
                TeamName 
                OwnerName
                Division
                AvlAddDrops
                TeamOwner {
                    items { 
                        TeamOwnerId
                        Email 
                        UserId
                        InvitationCode 
                      }
                }
          }
        }
      }`);
  return response.data.data?.teams?.items;
};

export const teamFinancesLoader = async (league) => {
  if (!Number.isInteger(league)) return [];
  const response = await postToApi(`{
        teams ( filter: {LeagueId: { eq: ${league} } } ) {
          items {
                TeamId
                TeamName 
                OwnerName
                EntryFee
                FeesPaid
                WinningsPaid
          }
        }
      }`);
  return response.data.data.teams.items;
};
export const teamPositionPlayerLoader = async (nflTeamId, position) => {
  const response = await postToApi(`{
        playerHistories ( 
            filter: {and: [
                { Player: {Position:  { PositionCode: { eq: "${position}" } } } } 
                { NflTeamId: { eq: ${nflTeamId} } } 
            ] } 
            ) {
            items {                
                Player {
                    PlayerId
                    EspnPlayerId
                    Name
                    NflTeam {
                        NflTeamId
                        Name
                        DisplayCode
                        DisplayName
                        ExternalCode
                    }
                    Position {
                        PositionCode
                    }
                    PlayerStatistic {
                        items {
                            Total
                            StatisticalCategory
                            PlayerStatisticVersion {
                                Week
                                Projected
                                NflGame{
                                    NflGameId
                                    GameDate
                                    Week
                                    HomeScore
                                    AwayScore
                                    AwayTeam {
                                        NflTeamId
                                        NflTeamCode
                                        DisplayName
                                        DisplayCode
                                    }
                                    HomeTeam {
                                        NflTeamId
                                        NflTeamCode
                                        DisplayName
                                        DisplayCode
                                    }
                                    BoxScoreURL
                                }
                            }
                        }
                    }
                }
            }
        }
    }`);

  return response?.data?.data?.playerHistories?.items;
};

export const playerLoader = async (player) => {
  if (!Number.isInteger(+player)) {
    return {};
  }
  const response = await postToApi(`{
        players ( filter: {PlayerId: { eq: ${player} } } ) {
          items {
            PlayerId
            EspnPlayerId
            Name
            NflTeam {
                NflTeamId
                Name
                DisplayCode
                DisplayName
                ExternalCode
            }
            Position {
                PositionCode
            }
            PlayerStatistic {
                items {
                    Total
                    StatisticalCategory
                    PlayerStatisticVersion {
                        Week
                        Projected
                        NflGame{
                            NflGameId
                            GameDate
                            Week
                            HomeScore
                            AwayScore
                            AwayTeam {
                                NflTeamId
                                NflTeamCode
                                DisplayName
                                DisplayCode
                            }
                            HomeTeam {
                                NflTeamId
                                NflTeamCode
                                DisplayName
                                DisplayCode
                            }
                            BoxScoreURL
                        }
                    }
                }
            }
            PlayerHistory {
                items {
                    NflTeamId
                    FromDate
                    ToDate
                    NflTeam {
                        NflTeamId
                        Name
                        DisplayCode
                        DisplayName
                        ExternalCode
                    }
                }
            }
          }
        }
      }`);
  return response.data.data?.players?.items[0];
};

export const teamLoader = async (team) => {
  if (!Number.isInteger(+team)) {
    return {};
  }
  const response = await postToApi(`{
        teams ( filter: {TeamId: { eq: ${team} } } ) {
          items {
                LeagueId
                TeamId
                TeamName 
                OwnerName
                Division
                AvlAddDrops
                TeamOwner {
                    items { 
                        TeamOwnerId
                        Email 
                        UserId
                        InvitationCode 
                      }
                }
          }
        }
      }`);
  return response.data.data?.teams?.items[0];
};

export const userTeamLoader = async (leagueId, userId) => {
  if (!Number.isInteger(+leagueId)) {
    return {};
  }
  const response = await postToApi(`{
        teams ( filter: {and: [
                    { TeamOwner: {UserId: { eq: "${userId}" } }  }
                    { LeagueId: { eq: ${leagueId} } } 
                ] } ) {
            items {
                LeagueId
                TeamId
                TeamName 
                OwnerName
                Division
                AvlAddDrops
                TeamOwner {
                    items { 
                        TeamOwnerId
                        Email 
                        UserId
                        InvitationCode 
                    }
                }
            }
        }
    }`);
  return response.data.data.teams.items.length > 0
    ? response.data.data.teams.items[0]
    : {};
};

export const lineupsLoader = async (league, week) => {
  if (!Number.isInteger(league) && !Number.isInteger(week)) return [];
  const response = await postToApi(`{
        lineups ( 
            filter: {and: [
                { Team: {LeagueId: { eq: ${league} } } } 
                { Week: { eq: ${week} } }
                { Active: { eq: true } }
            ] }
            orderBy: { TeamId : ASC } ) {
            items {
                SubmitDateTime
                Team {
                    TeamId
                    TeamName
                    OwnerName
                    LeagueId
                }
                LineupPlayer { 
                    items {
                        Starter
                        RosterPlayer {  
                            RosterPlayerId
                            PlayerId 
                            Player {
                                EspnPlayerId
                                Name
                                NflTeam {
                                    NflTeamId
                                    Name
                                    DisplayCode
                                }
                                Position {
                                    PositionId
                                    PositionCode
                                }
                            }
                        }
                    }
                }
            }
          
        }
      }`);
  return response.data.data?.lineups?.items;
};

export const teamLineupLoader = async (team, week) => {
  if (!Number.isInteger(team) && !Number.isInteger(team)) return [];
  const response = await postToApi(`{
        lineups ( 
            filter: {and: [
                { Week: {eq: ${week} } }
                { TeamId: { eq: ${team} } }
                { Active: { eq: true } }
            ] }
            first: 1
            orderBy: { LineupId : DESC } ) {
            items {
                Week
                SubmitDateTime
                Team {
                    TeamId
                    TeamName
                    OwnerName
                    LeagueId
                }
                LineupPlayer { 
                    items {
                        Starter
                        RosterPlayer {  
                            RosterPlayerId
                            PlayerId 
                            Player {
                                EspnPlayerId
                                Name
                                NflTeam {
                                    NflTeamId
                                    Name
                                    DisplayCode
                                }
                                Position {
                                    PositionId
                                    PositionCode
                                }
                            }
                        }
                    }
                }
            }
          
        }
      }`);
  return response.data.data?.lineups?.items[0];
};

export const fantasyGameLoader = async (league, week) => {
  if (!Number.isInteger(league) && !Number.isInteger(week)) return [];
  const response = await postToApi(`{
        fantasyGameResults ( 
            filter: {and: [
                { FantasyGame: {HomeTeam: {LeagueId:{ eq: ${league} } } } } 
                { PointVersion: {Week: { eq: ${week} } } } 
                { PointVersion: {Active: { eq: true } } } 
            ] }
            ) {
                items {
                    HomePointTotal
                    AwayPointTotal
                    PointVersion {
                        Projected
                    }
                    FantasyGame { 
                        FantasyGameId
                        HomeTeamId
                        HomeTeam 
                        { 
                            TeamName
                            OwnerName
                        }
                        AwayTeamId
                        AwayTeam 
                        { 
                            TeamName
                            OwnerName
                        }
                    }
                }
            }  
        }`);

  return response.data.data?.fantasyGameResults?.items;
};

export const leagueSettingsLoader = async (league) => {
  if (!Number.isInteger(league)) return [];
  const response = await postToApi(`query {
        executeGetLeagueSettings(
              LeagueId: ${league},
              )
          {
            LeagueId
            LeagueName
            NumberOfTeams
            ScheduleId
            Waivers
            WaiversFromWeek
            WaiversToWeek
            WaiverProcessDay
            WaiverProcessTime
            UnlimitedAddDrops
            UnlimitedAddDropsFromWeek
            UnlimitedAddDropsToWeek
            AddDropFee
            AddDropFeeFromWeek
            AddDropFeeToWeek
            KeeperLeague
            KeeperRound
            AllowDropEligibleKeeper
            LineupDeadline
            PlayoffScheduleId
            EntryFee
            AutoApprove
            AutoApproveTradesInDays
            TradesExpireInDays
            TradeCompletionLeadTimeInHours
        }
      }`);

  return response.data?.data?.executeGetLeagueSettings?.length > 0
    ? response.data?.data?.executeGetLeagueSettings[0]
    : [];
};

export const userLeaguesLoader = async (userId) => {
  if (!userId) return [];
  const response = await postToApi(`query {
        executeGetUserLeagues(
              UserId: "${userId}",
              )
          {
            LeagueId
            LeagueName
            Role
        }
      }`);

  return response.data?.data?.executeGetUserLeagues;
};

export const leaguePlayersLoader = async (
  league,
  spotCode = "ALL",
  availability = "ALL",
  page = 1,
  limit = 5,
  summaryType = 1,
  positionFilter = "All",
  nflTeamFilter = "All",
  nameFilter = " ",
  sortColumn = "Points",
  sortDirection = "DESC"
) => {
  if (!Number.isInteger(league)) return [];
  const response = await postToApi(`query {
        executeGetLeaguePlayersWithStatistics(
              LeagueId:${league},
              Availability:"${availability}",
              Page:${page},
              Limit:${limit},
              SpotCode:"${spotCode}",
              PositionFilter: "${positionFilter}",
              NflTeamFilter: "${nflTeamFilter}",
              NameFilter: "${nameFilter}",
              SortColumn: "${sortColumn}",
              SortOrder: "${sortDirection}",
              SummaryType: ${summaryType}
              )
          {
            TeamId
            TeamName
            OwnerName
            RosterPlayerId
            PlayerId
            EspnPlayerId
            PlayerName
            PositionId
            PositionCode
            NflTeamId
            DisplayCode
            Name
            ByeWeek
            RowNumber
            TotalRows
            Points
            PassYds
            PassTds
            PassInts
            RushingYds
            RushingTds
            ReceivingYds
            ReceivingTds
            Tackles
            Solo
            Sacks
            DefInts
            DefTds
            FGYds
            XPs
            StatusCode
            StatusDescription
            InjuryDate            
        }
      }`);

  return response?.data?.data?.executeGetLeaguePlayersWithStatistics;
};

export const playersLoader = async (
  { pagination, columnFilters, globalFilter, endCursor, sorting },
  useCursor
) => {
  const rowCount = pagination ? pagination.pageSize : 1;
  const filter = convertFilters(
    columnFilters,
    globalFilter,
    "{ Position : { PositionCode : { isNull: false}  }  }"
  );
  const sort = convertSorting(sorting);
  const after =
    useCursor && endCursor?.length > 0 ? `after:"${endCursor}"` : "";

  const response = await postToApi(`{
        players(${filter} first: ${rowCount} ${after} ${sort}) {
          items {
            PlayerId
            Name
            EspnPlayerId
            EspnPlayer{
                FirstName
                LastName
            }
            NflTeam {
                Name
                DisplayCode
            }
            Position {
                PositionCode
            }
            RosterPlayer {
                items {
                    DeleteDate
                    Team {
                        TeamId
                        TeamName
                        OwnerName
                        LeagueId
                    }
                }
            }
          }
          hasNextPage
          endCursor
        }
      }`);

  return response.data.data.players;
};

export const currentNflGameWeekLoader = async () => {
  const response = await postToApi(`{
        nflGames( 
            filter: {Final: { eq: false  } } first: 1 
             orderBy: { Week : ASC }) {
          items {
              Week
          }
        }
    }`);

  const week = response.data.data.nflGames?.items[0]
    ? response.data.data.nflGames.items[0].Week
    : 18;

  return week;
};

export const lastNflGameWeekPlayedLoader = async () => {
  const response = await postToApi(`{
        nflGames( 
            filter: {Final: { eq: true  } } first: 1 
             orderBy: { Week : DESC }) {
          items {
              Week
          }
        }
    }`);

  const week = response.data.data.nflGames?.items[0]
    ? response.data.data.nflGames.items[0].Week
    : 0;

  return week;
};

export const seasonYearLoader = async () => {
  const response = await postToApi(`{
        nflGames( 
            filter: {Week: { eq: 1  } } first: 1 
             orderBy: { Week : DESC }) {
          items {
            GameDate
          }
        }
    }`);

  const gameDate = response.data.data.nflGames?.items[0]
    ? response.data.data.nflGames.items[0].GameDate
    : new Date();

  return gameDate;
};

export const teamPrizeLoader = async (league) => {
  const response = await postToApi(`{
    teamPrizes( filter: {and: [
            { Team: {LeagueId: { eq: ${league} } } } 
        ] }
      orderBy: { Week : ASC } ) {
      items {
            Week
            TeamId
            PrizeAmount
            PrizeType
            Team {
                TeamId
                TeamName
                OwnerName
            }
        }
        }
    }`);

  return response.data.data?.teamPrizes?.items;
};

export const rosterSettingsLoader = async (league) => {
  const response = await postToApi(`{
        rosterFormats( filter: {and: [
                { LeagueId: { eq: ${league} } } 
            ] }
          ) {
          items {
                QB
                SQB
                TMQB
                STMQB
                RB
                SRB
                R
                SR
                WR
                SWR
                SRBWR
                TE
                STE
                PK
                SPK
                TMPK
                STMPK
                DF
                SDF
                TMDF
                STMDF
                LB
                SLB
                CB
                SCB
                S
                SS
                DB
                SDB
                DE
                SDE
                DT
                SDT
                DL
                SDL
                UT
            }
        }
    }`);

  return response.data.data?.rosterFormats?.items[0];
};

export const leaguePrizeSettingsLoader = async (league) => {
  const response = await postToApi(`{
        prizeSettings( filter: {and: [
                { LeagueId: { eq: ${league} } } 
            ] }
          ) {
          items {
                FirstPrize
                SecondPrize
                ThirdPrize
                WeeklyPrize
                PlayoffGamePrize
                FantasyBowlPrize
                FirstFeePrize
                SecondFeePrize
                ThirdFeePrize
            }
        }
    }`);

  return response.data.data?.prizeSettings?.items[0];
};

export const leagueCommissionerLoader = async (league) => {
  const response = await postToApi(`{
        leagueCommissioners( filter: {and: [
                { LeagueId: { eq: ${league} } } 
            ] }
          ) {
          items {
            LeagueCommissionerId
            UserId
            Email
            InvitationCode
            UpdateDateTime
            }
        }
    }`);

  return response.data.data?.leagueCommissioners?.items;
};

export const siteScheduleLoader = async () => {
  const response = await postToApi(`{
        schedules() {
          items {
                ScheduleId
                Description
                NumberOfTeams
                NumberOfWeeks
                NumberOfConferences
                NumberOfDivisions
                HomeAway
                ScheduleType
            }
        }
    }`);

  return response.data.data.schedules?.items;
};

export const leagueScheduleLoader = async (league, schedule = 0) => {
  const response = await postToApi(`{
        scheduleGames( filter: {and: [
                { Schedule: {ScheduleType: { eq: ${schedule} } } } 
                { FantasyGame: {HomeTeam: {LeagueId: { eq: ${league} } }  } } 
            ] }
          orderBy: { Week : ASC } ) {
          items {
                Week
                FantasyGame {
                    items {
                        FantasyGameId
                        HomeTeam {
                            TeamId
                            OwnerName
                            TeamName
                        }
                         AwayTeam {
                            TeamId
                            OwnerName
                            TeamName
                        }
                        FantasyGameResult {
                            items {
                                HomePointTotal
                                AwayPointTotal
                                PointVersion{
                                    Projected
                                    Active
                                    Complete
                                }
                            }
                        }
                    }
                }
          }
        }
      }`);

  return response.data.data.scheduleGames?.items;
};

export const teamScheduleLoader = async (team, schedule) => {
  const response = await postToApi(`{
        scheduleGames( filter: {and: [
                { Schedule: {ScheduleType: { eq: ${schedule} } } } 
                { or: [ 
                    { FantasyGame: {HomeTeamId:  { eq: ${team} }  } }
                    { FantasyGame: {AwayTeamId:  { eq: ${team} }  } }
                ] } 
            ] }
            orderBy: { Week : ASC } ) {
            items {
                Week
                FantasyGame {
                    items {
                        FantasyGameId
                        HomeTeam {
                            TeamId
                            OwnerName
                            TeamName
                        }
                         AwayTeam {
                            TeamId
                            OwnerName
                            TeamName
                        }
                        FantasyGameResult {
                            items {
                                HomePointTotal
                                AwayPointTotal
                                PointVersion{
                                    Projected
                                    Active
                                    Complete
                                }
                            }
                        }
                    }
                }
            }
        }
      }`);

  return response.data.data?.scheduleGames?.items;
};

export const transactionFeeLoader = async (league) => {
  const response = await postToApi(`{
        transactions( filter: {or: [
                {RosterPlayerAdded: { Team: {LeagueId: { eq: ${league} } }  }}
            ] }
           ) {
          items {
                TransactionFee
                RosterPlayerAdded {
                    Team {
                        TeamId
                    }
                }
            }
        }
      }`);

  return response.data.data.transactions?.items;
};

export const teamWaiverRequestsLoader = async (team, status) => {
  const response = await postToApi(`
    {
        waiverRequests( filter: {and: [
                {TeamId: { eq: ${team} } }
                {WaiverRequestStatus: { eq: ${status} }}
            ] }
            orderBy: { Priority : ASC } ) {
          items {
                WaiverRequestId
                Priority
                Week
                WaiverRequestStatus
                RosterPlayerToDelete {
                    Player {
                        PlayerId
                        Name
                        Position {
                            PositionCode
                        }
                        NflTeam {
                            DisplayCode
                        }
                    }
                }
                PlayerToAdd {
                    PlayerId
                    Name
                    Position {
                        PositionCode
                    }
                    NflTeam {
                        DisplayCode
                    }
                }
            }
        }
      }
    `);

  return response.data.data?.waiverRequests?.items;
};

export const teamTransactionsLoader = async (team) => {
  const response = await postToApi(`{
        transactions( filter: {or: [
                {RosterPlayerAdded: { Team: {TeamId: { eq: ${team} } }  }}
            ] }
            orderBy: { TransactionDate : ASC } ) {
          items {
                TransactionId
                TransactionFee
                TransactionDate
                TransactionType
                WaiverRequestId
                WaiverRequest {
                    Week
                }
                RosterPlayerAdded {
                    Player {
                        PlayerId
                        Name
                        Position {
                            PositionCode
                        }
                    }
                }
                RosterPlayerDeleted {
                    Player {
                        PlayerId
                        Name
                        Position {
                            PositionCode
                        }
                    }
                }
            }
        }
      }`);

  return response.data.data?.transactions?.items;
};

export const leagueTransactionsLoader = async (league) => {
  const response = await postToApi(`{
        transactions( filter: {or: [
                {RosterPlayerAdded: { Team: {LeagueId: { eq: ${league} } }  }}
            ] }
            orderBy: { TransactionDate : DESC } ) {
          items {
                TransactionId
                TransactionFee
                TransactionDate
                TransactionType
                WaiverRequestId
                WaiverRequest {
                    Week
                }
                RosterPlayerAdded {
                    Player {
                        PlayerId
                        Name
                        Position {
                            PositionCode
                        }
                    }
                    Team {
                        TeamId
                        OwnerName
                        TeamName
                    }
                }
                RosterPlayerDeleted {
                    Player {
                        PlayerId
                        Name
                        Position {
                            PositionCode
                        }
                    }
                    Team {
                        TeamId
                        OwnerName
                        TeamName
                    }
                }
            }
        }
      }`);

  return response.data.data.transactions?.items;
};

export const leagueWaiverResultsLoader = async (league, week) => {
  const response = await postToApi(`{
        waiverRequestResults( filter: {and: [
                { WaiverRequest: { Team: {LeagueId: { eq: ${league} } }  }}
                { WaiverRequest: {Week: { eq: ${week} } } }
            ] }
          orderBy: { TeamWaiverRank : ASC } ) {
          items {
                WaiverRequestId
                TransactionDenialReason
                TeamWaiverRank
                RequestNumber
                ProcessDate
                WaiverRequest {
                    WaiverRequestStatus
                    PlayerToAdd {
                        PlayerId
                        Name
                        Position {
                            PositionCode
                        }
                    }
                    Team {
                        TeamId
                        OwnerName
                        TeamName
                    }
                    RosterPlayerToDelete {
                        Player {
                            PlayerId
                            Name
                            Position {
                                PositionCode
                            }
                        }
                    }
                }
            }
        }
      }`);

  return response.data.data.waiverRequestResults?.items;
};

export const teamTradesLoader = async (team, status) => {
  const response = await postToApi(`{
        trades( filter: {or: [
                {GivingTeamId: { eq: ${team} } }
                {ReceivingTeamId: { eq: ${team} } }
            ] }
            orderBy: { TradeDate : ASC } ) {
          items {
                TradeId
                TradeStatus
                TradeDate
                GivingTeam {
                    TeamId
                    TeamName
                    OwnerName
                }
                ReceivingTeam {
                    TeamId
                    TeamName
                    OwnerName
                }
                TradeDetails {
                    items {
                        GivingRosterPlayerId
                        GivingRosterPlayer {
                            Player {
                                Name
                                NflTeam {
                                    Name
                                    DisplayCode
                                }
                                Position {
                                    PositionCode
                                }
                            }
                        }
                        ReceivingRosterPlayerId
                        ReceivingRosterPlayer{
                            Player {
                                Name
                                NflTeam {
                                    Name
                                    DisplayCode
                                }
                                Position {
                                    PositionCode
                                }
                            }
                        }
                    }
                }
            }
        }
      }`);

  return response.data.data?.trades?.items;
};

export const leagueTradesLoader = async (league) => {
  const response = await postToApi(`{
        trades( filter: 
            { GivingTeam: {LeagueId: { eq: ${league} } }  }
            orderBy: { TradeDate : ASC } ) {
          items {
                TradeId
                TradeStatus
                TradeDate
                GivingTeam {
                    TeamId
                    TeamName
                    OwnerName
                }
                ReceivingTeam {
                    TeamId
                    TeamName
                    OwnerName
                }
                TradeDetails {
                    items {
                        GivingRosterPlayerId
                        ReceivingRosterPlayerId
                        GivingRosterPlayer {
                            Player {
                                Name
                                NflTeam {
                                    Name
                                    DisplayCode
                                }
                                Position {
                                    PositionCode
                                }
                            }
                        }
                        ReceivingRosterPlayer{
                            Player {
                                Name
                                NflTeam {
                                    Name
                                    DisplayCode
                                }
                                Position {
                                    PositionCode
                                }
                            }
                        }
                    }
                }
            }
        }
    }`);

  return response.data.data?.trades?.items;
};
