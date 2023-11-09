import { Container } from "@mui/material";

export default function PlayerImage({ positionCode, nflTeamCode, espnPlayerId, height = 30, sx }) {
    return (
        <Container sx={sx}>
            {positionCode?.startsWith('TM') ?

                <img
                    alt={nflTeamCode}
                    height={height}
                    src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/${nflTeamCode}.png&h=150&w=150`}
                    loading="lazy"
                    style={{ borderRadius: '50%' }}
                />
                : espnPlayerId ?
                    <img
                        alt="?"
                        height={height}
                        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${espnPlayerId}.png&h=120&w=120&scale=crop`}
                        loading="lazy"
                        style={{ borderRadius: '50%' }}
                    />
                    :
                    <img
                        alt="?"
                        height={height}
                        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=120&h=120&scale=crop`}
                        loading="lazy"
                        style={{ borderRadius: '50%' }}
                    />
            }</Container>
    )
}