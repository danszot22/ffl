import PageToolbar from "../common/PageToolbar";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/authenticate";

function ResetPassword() {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const result = await resetPassword(email, id, newPassword);
    if (result?.Message) {
      setMessage(result?.Message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 2,
      }}
    >
      <PageToolbar title={"Reset Password"} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 2,
        }}
      >
        <TextField
          id="email"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          id="newPassword"
          label="New Password"
          value={newPassword}
          type={"password"}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <TextField
          id="confirmNewPassword"
          label="Confirm New Password"
          value={confirmNewPassword}
          type={"password"}
          onChange={(event) => setConfirmNewPassword(event.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          p: 2,
        }}
      >
        <Button variant="contained" sx={{ mt: 1, ml: 1 }} onClick={handleSave}>
          Change Password
        </Button>
        <Button
          variant="contained"
          sx={{ mt: 1, ml: 1 }}
          onClick={() => navigate("/Login")}
        >
          Back To Login
        </Button>
      </Box>
      <Divider />
      <Typography sx={{ mt: 1, ml: 1 }} color="error">
        {message}
      </Typography>
    </Box>
  );
}

export default ResetPassword;
