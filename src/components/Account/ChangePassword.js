import Root from "../Root";
import withAuth from "../withAuth";
import PageToolbar from "../common/PageToolbar";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/authenticate";

function ChangePassword({ user }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [response, setResponse] = useState('');

    const navigate = useNavigate();

    const handleSave = async () => {
        const result = await changePassword(user?.userId, oldPassword, newPassword);
        if (result?.Message) {
            setResponse(result);
        }
    }

    return (
        <Root>
            <PageToolbar title={"Change Password"} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 2
            }}>
                <TextField
                    id="oldPassword"
                    label="Current Password"
                    value={oldPassword}
                    type={'password'}
                    onChange={(event) => setOldPassword(event.target.value)}
                />
                <TextField
                    id="newPassword"
                    label="New Password"
                    value={newPassword}
                    type={'password'}
                    onChange={(event) => setNewPassword(event.target.value)}
                />
                <TextField
                    id="confirmNewPassword"
                    label="Confirm New Password"
                    value={confirmNewPassword}
                    type={'password'}
                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                />
            </Box>
            <Divider />
            <Button
                variant="contained"
                sx={{ mt: 1, ml: 1 }}
                onClick={handleSave}
            >
                Save
            </Button>
            <Button
                variant="contained"
                sx={{ mt: 1, ml: 1 }}
                onClick={() => navigate(-1)}
            >
                Cancel
            </Button>
            <Typography sx={{ mt: 1, ml: 1 }} color="error">
                {response?.Message}
            </Typography>
        </Root>
    )
}

export default withAuth(ChangePassword);