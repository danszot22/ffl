import { Box } from "@mui/material";
import ManagerCard from "./ManagerCard";

function ManagerList({ team, handleDeleteClick, isEditable }) {
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      {team.TeamOwner.items.map((teamOwner) => {
        return (
          <ManagerCard
            key={teamOwner.TeamOwnerId}
            manager={teamOwner}
            isEditable={isEditable}
            handleDeleteClick={() => handleDeleteClick(team, teamOwner)}
          />
        );
      })}
    </Box>
  );
}

export default ManagerList;
