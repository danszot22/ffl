import {
  Button,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardActionArea,
} from "@mui/material";

function ManagerCard({ manager, handleDeleteClick, isEditable }) {
  return (
    <Card variant="outlined">
      <CardActionArea>
        <CardContent sx={{ fontSize: 14, p: 1, minWidth: 360 }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            {manager.name}
          </Typography>
          <Typography variant="body2">{manager.Email}</Typography>
          <Typography variant="body2">
            {manager.UserId
              ? "joined"
              : manager.InvitationCode
              ? "invited"
              : "new"}
          </Typography>
        </CardContent>
      </CardActionArea>
      {isEditable ? (
        <CardActions sx={{ fontSize: 14, p: 0 }}>
          <Button
            sx={{ p: 0 }}
            size="small"
            color="primary"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}

export default ManagerCard;
