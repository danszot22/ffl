import axios from "axios";

export const fflapiurl = "https://ffl2013.azurewebsites.net/api";
export const fflurl = "https://kind-sky-02d625b0f.4.azurestaticapps.net";

export const fflapi = axios.create({
  baseURL: fflapiurl,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getTransactionText = async (nflTeamId, rosterPlayerId) => {
  const result = await fflapi
    .get(`/rosterPlayer/${nflTeamId}/${rosterPlayerId}/transactionType`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const getRosterPlayersToDrop = async (leagueId, teamId, playerId) => {
  const result = await fflapi
    .get(`/rosterPlayer/${leagueId}/${teamId}/${playerId}/players`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const getPositionsToAdd = async (leagueId, teamId, playerId) => {
  const result = await fflapi
    .get(`/rosterPlayer/${leagueId}/${teamId}/${playerId}/positions`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateRoster = async (
  leagueId,
  teamId,
  playerId,
  rosterPlayerId
) => {
  const result = await fflapi
    .post(`/rosterPlayer/${leagueId}/${rosterPlayerId}/`, { teamId, playerId })
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateLineup = async (teamId, week, lineup) => {
  const result = await fflapi
    .post(`/lineup/${teamId}/${week}/`, lineup)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateTeams = async (leagueId, teams) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/teams`, teams)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateFinances = async (leagueId, teams) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/finances`, teams)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const reorganizeLeague = async (leagueId) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/reorganize`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const recreateSchedule = async (leagueId) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/reschedule`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const sendInvitations = async (leagueId) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/teamOwner/invitations`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const addManager = async (leagueId, manager) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/teamOwner`, manager)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const deleteManager = async (managerId) => {
  const result = await fflapi
    .delete(`/v2/league/teamOwner/${managerId}`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const approveTrade = async (tradeId) => {
  const result = await fflapi
    .post(`/trade/${tradeId}/approve`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const denyTrade = async (tradeId) => {
  const result = await fflapi.post(`/trade/${tradeId}/deny`).catch((error) => {
    const message = error.response?.data?.Message
      ? error.response?.data?.Message
      : error?.message
      ? error.message
      : "An error occurred";
    return { Message: message };
  });
  return result?.data ? result?.data : result;
};

export const acceptTrade = async (tradeId) => {
  const urlToPage = `${fflurl}/LeagueTrades`;
  const result = await fflapi
    .post(`/trade/${tradeId}/accept`, { urlToPage })
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const rejectTrade = async (tradeId) => {
  const result = await fflapi
    .post(`/trade/${tradeId}/reject`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const deleteTrade = async (tradeId) => {
  const result = await fflapi
    .delete(`/trade/${tradeId}/delete`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const createTrade = async (givingTeamId, receivingTeamId, players) => {
  const urlToPage = `${fflurl}/TeamTrades`;
  const result = await fflapi
    .post(`/trade/${givingTeamId}/${receivingTeamId}/create/`, {
      players,
      urlToPage,
    })
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateWaiverRequestOrder = async (teamId, requestIds) => {
  const result = await fflapi
    .post(`/waivers/${teamId}`, requestIds)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const deleteWaiverRequest = async (requestId) => {
  const result = await fflapi.delete(`/waivers/${requestId}`).catch((error) => {
    const message = error.response?.data?.Message
      ? error.response?.data?.Message
      : error?.message
      ? error.message
      : "An error occurred";
    return { Message: message };
  });
  return result?.data ? result?.data : result;
};

export const updateTeam = async (teamId, team) => {
  const result = await fflapi
    .post(`/v2/team/${teamId}`, team)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateAccount = async (userId, account) => {
  const result = await fflapi
    .post(`/account/${userId}`, account)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateDefaultLeague = async (userId, toLeagueId) => {
  const result = await fflapi
    .post(`/account/${userId}/league/${toLeagueId}`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const sendCommissionerInvitation = async (leagueId) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/commissioner/invitation`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const addCommissioner = async (leagueId, commissioner) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/commissioner`, commissioner)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const deleteCommissioner = async (commissionerId) => {
  const result = await fflapi
    .delete(`/v2/league/commissioner/${commissionerId}`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const deleteRosterPlayer = async (leagueId, rosterPlayerId) => {
  const result = await fflapi
    .delete(`/rosterPlayer/${leagueId}/${rosterPlayerId}/`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateRosterFormat = async (leagueId, format) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/rosterFormat`, format)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updatePrizes = async (leagueId, prizes) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/prizes`, prizes)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateSettings = async (leagueId, settings) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/settings`, settings)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const updateSize = async (leagueId, size) => {
  const result = await fflapi
    .post(`/v2/league/${leagueId}/size`, size)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};

export const getPlayoffBracket = async (leagueId) => {
  const result = await fflapi
    .get(`/schedule/playoffBracket/${leagueId}`)
    .catch((error) => {
      const message = error.response?.data?.Message
        ? error.response?.data?.Message
        : error?.message
        ? error.message
        : "An error occurred";
      return { Message: message };
    });
  return result?.data ? result?.data : result;
};
