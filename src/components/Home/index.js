import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import Root from '../Root';

function Home() {
    return (
        <Root>
            <Box component="main" sx={{ p: 3 }}>
                <h1>Fantasy Football</h1>
                <Typography>
                    A web site dedicated to Rotisserie style fantasy football leagues.
                </Typography>
            </Box>
        </Root>
    )
}
export default Home;