import { useState } from "react";
import PageToolbar from "../common/PageToolbar";
import { sendEmailwithPasswordReset } from "../../api/authenticate";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    const result = await sendEmailwithPasswordReset(email);
    setResponse(result);
  };

  const handleBack = async () => {
    navigate(-1);
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
      <PageToolbar title="Forgot Password" />
      <TextField
        id="email"
        label="Email"
        value={email}
        helperText="A password reset link will be sent to email address provided"
        onChange={(event) => setEmail(event.target.value)}
        InputProps={{
          type: "text",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          p: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{ mt: 1, ml: 1 }}
          onClick={handleSendEmail}
        >
          Send Email
        </Button>
        <Button variant="contained" sx={{ mt: 1, ml: 1 }} onClick={handleBack}>
          Back to Login
        </Button>
      </Box>
      <Typography color="error">{response?.Message}</Typography>
    </Box>
  );
};

export default ForgotPassword;
