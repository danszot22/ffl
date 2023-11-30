import axios from "axios";

async function getFromEspnApi(url) {
  const options = {
    method: "GET",
    url: url,
    headers: {
      "content-type": "application/json",
    },
  };
  return await axios.request(options).catch((error) => {
    return error?.response;
  });
}

export const playerNewsLoader = async (season, espnPlayerId, teamId) => {
  let news = [];
  try {
    const teamResponse = await getFromEspnApi(
      `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams/${teamId}/injuries?limit=1000`
    );
    teamResponse?.data?.items?.forEach(async (item) => {
      if (item.$ref.includes("athletes/" + espnPlayerId)) {
        const response = await getFromEspnApi(item.$ref);
        news = news.concat(response?.data);
      }
    });
    const response = await getFromEspnApi(
      `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${season}/athletes/${espnPlayerId}/injuries?limit=1000`
    );
    response?.data?.items?.forEach((item) => {
      news = news.concat(item);
    });
  } catch (error) {
    console.error(error);
    return;
  }
  //eliminate duplicate news items by id
  const result = Array.from(new Set(news.map((s) => s.id))).map((id) => {
    return news.find((s) => s.id === id);
  });
  return result;
};
