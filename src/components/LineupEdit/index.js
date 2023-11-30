import { NflWeekContext } from "../../contexts/NflWeekContext";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  mapTeamScoringTotals,
  mapRosterToTeamLineup,
  mapLineupToTeamLineup,
} from "../../utils/parsers";
import withAuth from "../withAuth";
import LineupTable from "./LineupTable";
import useTeamLineupData from "../../hooks/useTeamLineupData";
import { updateLineup } from "../../api/ffl";

function LineupEdit({ league, team }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { state: nflWeekState } = useContext(NflWeekContext);
  const [roster, setRoster] = useState();
  const [week, setWeek] = useState(
    searchParams.has("week")
      ? +searchParams.get("week")
      : nflWeekState?.lineupWeek
  );
  const [settings, setSettings] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [teamRoster, setTeamRoster] = useState([]);
  const [teamScoring, setTeamScoring] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    rosterSettingData,
    nflGameData,
    teamLineupData,
    scoringData,
    leagueRosterData,
  } = useTeamLineupData(
    league?.LeagueId,
    Number.isInteger(+id) ? +id : team?.TeamId,
    week
  );

  useEffect(() => {
    if (!searchParams.has("week")) setWeek(nflWeekState.lineupWeek);
  }, [searchParams, nflWeekState]);

  useEffect(() => {
    setTeamScoring(
      mapTeamScoringTotals(scoringData).totals.find(
        (total) => total?.key === (Number.isInteger(+id) ? +id : team?.TeamId)
      )
    );
  }, [scoringData, id, team?.TeamId]);

  useEffect(() => {
    if (leagueRosterData)
      setTeamRoster(
        leagueRosterData.filter(
          (rosterPlayer) =>
            rosterPlayer?.TeamId ===
            (Number.isInteger(+id) ? +id : team?.TeamId)
        )
      );
  }, [leagueRosterData, id, team?.TeamId]);

  useEffect(() => {
    setSettings(rosterSettingData);
  }, [rosterSettingData]);

  useEffect(() => {
    if (nflWeekState && week && week < nflWeekState.lineupWeek) {
      setRoster(mapLineupToTeamLineup(teamLineupData, nflGameData));
    } else {
      setRoster(
        mapRosterToTeamLineup(
          teamRoster,
          teamScoring,
          nflGameData,
          teamLineupData
        )
      );
    }
  }, [
    nflWeekState,
    nflWeekState?.lineupWeek,
    week,
    teamRoster,
    teamScoring,
    nflGameData,
    teamLineupData,
  ]);

  useEffect(() => {
    if (nflWeekState?.lineupWeek > week) {
      setErrorList([
        `Deadline has passed. Lineups are locked for week ${week}.`,
      ]);
    } else if (nflWeekState?.lineupWeek < week) {
      setErrorList([`Future week lineups cannot be set.`]);
    } else {
      setErrorList([]);
    }
  }, [nflWeekState?.lineupWeek, week]);

  const validateLineup = (rs) => {
    let errors = [];
    const stmqb = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "TMQB"
    ).length;
    const sqb = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "QB"
    ).length;
    const stmpk = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "TMPK"
    ).length;
    const spk = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "PK"
    ).length;
    const srb = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "RB"
    ).length;
    const swr = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "WR"
    ).length;
    const ste = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "TE"
    ).length;
    const sr = roster?.Players?.filter(
      (rp) =>
        rp.Starting && ["WR", "TE"].includes(rp.Player.Position.PositionCode)
    ).length;
    const scb = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "CB"
    ).length;
    const ss = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "S"
    ).length;
    const sdb = roster?.Players?.filter(
      (rp) =>
        rp.Starting && ["CB", "S"].includes(rp.Player.Position.PositionCode)
    ).length;
    const slb = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "LB"
    ).length;
    const sdt = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "DT"
    ).length;
    const sde = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "DE"
    ).length;
    const sdl = roster?.Players?.filter(
      (rp) =>
        rp.Starting && ["DT", "DE"].includes(rp.Player.Position.PositionCode)
    ).length;
    const stmdf = roster?.Players?.filter(
      (rp) => rp.Starting && rp.Player.Position.PositionCode === "TMDF"
    ).length;
    const sdf = roster?.Players?.filter(
      (rp) =>
        rp.Starting &&
        ["CB", "S", "DE", "DT", "LB"].includes(rp.Player.Position.PositionCode)
    ).length;

    if (rs.STMQB !== stmqb) {
      errors.push("Invalid number of Team QBs");
    }
    if (rs.SQB !== sqb) {
      errors.push("Invalid number of QBs");
    }
    if (rs.STMPK !== stmpk) {
      errors.push("Invalid number of Team Kickers");
    }
    if (rs.SPK !== spk) {
      errors.push("Invalid number of Kickers");
    }
    if (rs.SRB > srb) {
      errors.push("Invalid number of RBs");
    }
    if (rs.SWR > swr) {
      errors.push("Invalid number of  Wide Receivers");
    }
    if (rs.STE > ste) {
      errors.push("Invalid number of Tight Ends");
    }
    if (rs.SR > sr) {
      errors.push("Invalid number of Receivers");
    }
    if (rs.SCB > scb) {
      errors.push("Invalid number of Cornerbacks");
    }
    if (rs.SS > ss) {
      errors.push("Invalid number of Safeties");
    }
    if (rs.SDB + rs.SCB + rs.SS > sdb) {
      errors.push("Invalid number of Defensive Backs");
    }
    if (rs.SLB > slb) {
      errors.push("Invalid number of Linebackers");
    }
    if (rs.SDT > sdt) {
      errors.push("Invalid number of Defensive Tackles");
    }
    if (rs.SDE > sde) {
      errors.push("Invalid number of Defensive Ends");
    }
    if (rs.SDL + rs.SDT + rs.SDE > sdl) {
      errors.push("Invalid number of Defensive Linemen");
    }
    if (rs.STMDF > stmdf) {
      errors.push("Invalid number of Team Defenses");
    }
    if (
      rs.SDF + rs.SCB + rs.SS + rs.SDB + rs.SLB + rs.SDL + rs.SDT + rs.SDE !==
      sdf
    ) {
      errors.push("Invalid number of Defensive Players");
    }
    if (rs.SRBWR + rs.SRB + rs.SR + rs.STE + rs.SWR !== srb + swr + ste) {
      errors.push("Invalid number of combined RBs and Receivers");
    }
    setErrorList(errors);
  };

  const handleSave = async () => {
    if (errorList.length === 0) {
      setIsUpdating(true);
      const newLineup = roster?.Players.map((rosterPlayer) => {
        const lineup = {
          RosterPlayerId: rosterPlayer.RosterPlayerId,
          Starter: rosterPlayer.Starting,
        };
        return lineup;
      });

      const result = await updateLineup(
        Number.isInteger(+id) ? +id : team?.TeamId,
        week,
        newLineup
      );
      setIsUpdating(false);
      if (result?.Message) {
        setErrorList([result?.Message]);
      } else {
        navigate(`/Lineups`);
      }
    }
  };

  const handleChange = (event) => {
    //const originalPlayers = [...roster.Players];
    const player = roster?.Players?.find(
      (rosterPlayer) => +event.target.name === rosterPlayer.RosterPlayerId
    );
    if (player) {
      player.Starting = event.target.checked;
      const newPlayers = roster?.Players.map((rosterPlayer) =>
        rosterPlayer.RosterPlayerId === player.RosterPlayerId
          ? player
          : rosterPlayer
      );
      const newRoster = {
        key: roster.key,
        team: { ...roster.team },
        Players: [...newPlayers],
      };
      setRoster(newRoster);
    }
    validateLineup(settings);
  };

  return (
    <LineupTable
      isUpdating={isUpdating}
      roster={roster}
      week={week}
      errorList={errorList}
      handleSave={handleSave}
      handleChange={handleChange}
      currentWeek={nflWeekState?.lineupWeek}
    />
  );
}

export default withAuth(LineupEdit);
