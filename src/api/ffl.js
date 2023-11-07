import axios from "axios";

export const fflapi = axios.create({
    baseURL: 'http://localhost:39826/api',
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