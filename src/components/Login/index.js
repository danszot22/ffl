import { Box, Button, Divider, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { authenticateLogin } from "../../api/authenticate";
import { FantasyTeamContext } from "../../contexts/FantasyTeamContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useSearchParams } from "react-router-dom";
import { dispatchTokenData } from "../../utils/helpers";
import PageToolbar from "../common/PageToolbar";

export default function Login() {
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState(searchParams.has("error") ? 'There was a problem with your previous request. Please Login' : null);

    const { dispatch } = useContext(FantasyTeamContext);
    const navigate = useNavigate();

    useEffect(() => {
        const processTokenPayLoad = async (tokenPayLoad) => {
            if (tokenPayLoad?.userName) {
                dispatchTokenData(dispatch, tokenPayLoad);

                navigate(`/`);
            }
        }
        if (token) {
            const tokenPayLoad = jwtDecode(token);
            processTokenPayLoad(tokenPayLoad);
            localStorage.setItem('token', token);
        }
    }, [token, navigate, dispatch]);

    const handleLogin = async () => {
        const result = await authenticateLogin(username, password);
        if (result?.Token) {
            setError(null);
            setToken(result?.Token);
        }
        else {
            setError(result?.Message ? result?.Message : "Login failed");
        }
        if (result?.RefreshToken) {
            setError(null);
            localStorage.setItem('refreshToken', result?.RefreshToken);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: 2
        }}>
            <PageToolbar title='Login' />
            <TextField
                id="username"
                label="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                InputProps={{
                    type: 'text',
                }}
            />
            <TextField
                id="password"
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                InputProps={{
                    type: 'password',
                }}
            />
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 3,
                p: 2
            }}>
                <Button
                    variant="contained"
                    sx={{ mt: 1, ml: 1 }}
                    onClick={handleLogin}
                >
                    Login
                </Button>
                <Button variant="contained"
                    sx={{ mt: 1, ml: 1 }}
                    to='/ForgotUsername'>
                    Forgot Username
                </Button>
                <Button variant="contained"
                    sx={{ mt: 1, ml: 1 }}
                    to='/ForgotPassword'>
                    Forgot Password
                </Button>
            </Box>
            {error ?
                <Typography color="error">
                    {error}
                </Typography>
                : null}
        </Box>

    )
}