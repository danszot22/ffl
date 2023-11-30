import Root from "../Root";
import PageToolbar from "../common/PageToolbar";

export default function PlayoffBracket() {
  const divisionCount = 3;
  const firstRoundGames = 4;

  return (
    <Root title={"Playoff Bracket"}>
      <PageToolbar title={"Playoff Bracket"} />
      <div>
        <small>Playoff Seeding based on following tie-breaker formula: </small>
        <ul>
          <li>
            <small>
              {`Division Champions get top seeds (1-${divisionCount}), Wild Card Teams get remaining seeds (${
                divisionCount + 1
              }-${firstRoundGames * 2}`}
              )
            </small>
          </li>
          <li>
            <small>
              Division Champions will be based on Overall Record. If two or more
              teams are tied for the Division Championship, then ties will be
              broken by Head-to-Head record first, then Division record, and
              finally Overall points.
            </small>
          </li>
          <li>
            <small>
              Wild Card Teams will be based on Overall Record. If two or more
              teams are tied for a Wild Card Spot, then ties will be broken by
              Head-to-Head record first, and then Overall points.
            </small>
          </li>
          <li>
            <small>
              The Head-to-Head tie-breaker for Wild Card spots will only be used
              if all teams have played the same number of Head-to-Head games.
            </small>
          </li>
          <li>
            <small>
              Overall record is based on winning percentage. Therefore, a team
              that is 8-5-0 and a team that is 7-4-2 would have the same winning
              percentage, and thus would be considered tied for Overall record.
            </small>
          </li>
          <li>
            <small>
              Head-to-head record is based on the number of weeks won or lost
              during the season. If Team A defeated Team B 88-60 and then lost
              to Team B 92-91, their Head-to-head record would be 1-1.
            </small>
          </li>
          <li>
            <small>
              If there is a tie between three or more teams, and one team
              advances out of the tiebreaker, the remaining teams are then
              compared starting at the beginning of the tie-breaking formula
              until all ties are settled.
            </small>
          </li>
        </ul>
        <small>Tie-Breaker for Playoff Games: </small>
        <ul>
          <li>
            <small>
              In the event that two teams have the same number of points at the
              conclusion of their playoff game, the tiebreaker for Playoff Games
              will be the highest seeding in the playoffs, with the exception of
              the Fantasy Bowl, where a tie will result in a co-championship.
            </small>
          </li>
        </ul>
      </div>
    </Root>
  );
}
