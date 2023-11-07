import GroupLeaders from "./GroupLeaders";
import Root from "../Root";
import { Box } from "@mui/material";
import PageToolbar from "../common/PageToolbar";

export default function Leaders() {

    return (
        <Root>
            <PageToolbar title={'Statistical Leaders'} />
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: { xs: 'column', sm: 'row' },
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                textAlign: 'center',
                minWidth: 600,
            }}
            >
                <GroupLeaders availability={'All'} spot={'TMQB'} />
                <GroupLeaders availability={'Available'} spot={'TMQB'} />
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: { xs: 'column', sm: 'row' },
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                textAlign: 'center',
                minWidth: 600,
            }}
            >
                <GroupLeaders availability={'All'} spot={'RB'} />
                <GroupLeaders availability={'Available'} spot={'RB'} />
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: { xs: 'column', sm: 'row' },
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                textAlign: 'center',
                minWidth: 600,
            }}
            >
                <GroupLeaders availability={'All'} spot={'R'} />
                <GroupLeaders availability={'Available'} spot={'R'} />
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: { xs: 'column', sm: 'row' },
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                textAlign: 'center',
                minWidth: 600,
            }}
            >
                <GroupLeaders availability={'All'} spot={'DF'} />
                <GroupLeaders availability={'Available'} spot={'DF'} />
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flexDirection: { xs: 'column', sm: 'row' },
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                textAlign: 'center',
                minWidth: 600,
            }}
            >
                <GroupLeaders availability={'All'} spot={'TMPK'} />
                <GroupLeaders availability={'Available'} spot={'TMPK'} />
            </Box>
        </Root>

    )
}