import axios from "axios";

export const fflapi = axios.create({
    baseURL: 'https://ffltest.azurewebsites.net/api',
    headers: {
        'content-type': 'application/json'
    }
});

export const getTransactionText = async (nflTeamId, rosterPlayerId) => {

    const result = await fflapi.get(`/rosterPlayer/${nflTeamId}/${rosterPlayerId}/transactionType`)
        .catch((error) => {
            return error?.response;
        });
    return result?.data;
}

export const getRosterPlayersToDrop = async (leagueId, teamId, playerId) => {

    const result = await fflapi.get(`/rosterPlayer/${leagueId}/${teamId}/${playerId}/players`)
        .catch((error) => {
            return error?.response;
        });
    return result?.data;
}

export const getPositionsToAdd = async (leagueId, teamId, playerId) => {

    const result = await fflapi.get(`/rosterPlayer/${leagueId}/${teamId}/${playerId}/positions`)
        .catch((error) => {
            return error?.response;
        });
    return result?.data;
}

export const updateRoster = async (leagueId, teamId, playerId, rosterPlayerId) => {
    const result =
        await fflapi
            .post(`/rosterPlayer/${leagueId}/${rosterPlayerId}/`, { teamId, playerId })
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const updateLineup = async (teamId, week, lineup) => {
    const result =
        await fflapi
            .post(`/lineup/${teamId}/${week}/`, lineup)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const updateTeams = async (leagueId, teams) => {
    const result =
        await fflapi
            .post(`/v2/league/${leagueId}/teams`, teams)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const reorganizeLeague = async (leagueId) => {
    const result =
        await fflapi
            .post(`/v2/league/${leagueId}/reorganize`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const recreateSchedule = async (leagueId) => {
    const result =
        await fflapi
            .post(`/v2/league/${leagueId}/reschedule`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const sendInvitations = async (leagueId) => {
    const result =
        await fflapi
            .post(`/v2/league/${leagueId}/invitations`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const addManager = async (leagueId, manager) => {
    const result =
        await fflapi
            .post(`/v2/league/${leagueId}/teamOwner`, manager)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const deleteManager = async (managerId) => {
    const result =
        await fflapi
            .delete(`/v2/league/teamOwner/${managerId}`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const approveTrade = async (tradeId) => {
    const result =
        await fflapi
            .post(`/trade/${tradeId}/approve`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const denyTrade = async (tradeId) => {
    const result =
        await fflapi
            .post(`/trade/${tradeId}/deny`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const acceptTrade = async (tradeId) => {
    const result =
        await fflapi
            .post(`/trade/${tradeId}/accept`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const rejectTrade = async (tradeId) => {
    const result =
        await fflapi
            .post(`/trade/${tradeId}/reject`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const deleteTrade = async (tradeId) => {
    const result =
        await fflapi
            .delete(`/trade/${tradeId}/delete`)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export const createTrade = async (givingTeamId, receivingTeamId, players) => {
    const result =
        await fflapi
            .post(`/trade/${givingTeamId}/${receivingTeamId}/create`, players)
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}