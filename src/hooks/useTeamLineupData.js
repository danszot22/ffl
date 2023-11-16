import { leaguePlayersLoader, scoringLoader, nflGamesLoader, rosterSettingsLoader, teamLineupLoader } from "../api/graphql";
import { useQuery } from "@tanstack/react-query";

export default function useTeamLineupData(leagueId, teamId, week) {

    const { data: rosterSettingData } = useQuery({
        queryKey: ['rosterSettings', leagueId],
        queryFn: async () => {
            return await rosterSettingsLoader(leagueId);
        },
        refetchInterval: 5 * 60 * 1000, // 5 minutes
    });

    const { data: nflGameData } = useQuery({
        queryKey: ['nflGames', week],
        queryFn: async () => {
            if (!week) return [];
            return await nflGamesLoader(week);
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    const { data: teamLineupData } = useQuery({
        queryKey: ['teamLineup', teamId, week],
        queryFn: async () => {
            if (!week) return [];
            return await teamLineupLoader(teamId, week);
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    const { data: scoringData } = useQuery({
        queryKey: ['scoring', leagueId, week],
        queryFn: async () => {
            if (!week) return [];
            return await scoringLoader(leagueId, week);
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    const { data: leagueRosterData } = useQuery({
        queryKey: ['leagueRosters', leagueId, week],
        queryFn: async () => {
            if (!week) return [];
            return await leaguePlayersLoader(leagueId, "All", "OnRosters", 1, 1000, 1, "All", "All", " ", "PositionId", "ASC");
        },
        refetchInterval: 30 * 1000, //30 seconds
    });

    return { rosterSettingData, nflGameData, teamLineupData, scoringData, leagueRosterData };
}