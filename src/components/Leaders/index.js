import GroupLeaders from "./GroupLeaders";
import Root from "../Root";
import { Box } from "@mui/material";
import PageToolbar from "../common/PageToolbar";

function RowGroup({ children }) {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: { xs: 'column', lg: 'row' },
            p: { xs: 0, md: 1 },
            m: { xs: 0, md: 1 },
            bgcolor: 'background.paper',
            borderRadius: 1,
            textAlign: 'center',
            minWidth: { md: 600 },
        }}
        >
            {children}
        </Box>
    )
}

export default function Leaders() {

    return (
        <Root>
            <PageToolbar title={'Statistical Leaders'} />
            <RowGroup>
                <GroupLeaders availability={'All'} spot={'TMQB'} />
                <GroupLeaders availability={'Available'} spot={'TMQB'} />
            </RowGroup>
            <RowGroup>
                <GroupLeaders availability={'All'} spot={'RB'} />
                <GroupLeaders availability={'Available'} spot={'RB'} />
            </RowGroup>
            <RowGroup>
                <GroupLeaders availability={'All'} spot={'R'} />
                <GroupLeaders availability={'Available'} spot={'R'} />
            </RowGroup>
            <RowGroup>
                <GroupLeaders availability={'All'} spot={'DF'} />
                <GroupLeaders availability={'Available'} spot={'DF'} />
            </RowGroup>
            <RowGroup>
                <GroupLeaders availability={'All'} spot={'TMPK'} />
                <GroupLeaders availability={'Available'} spot={'TMPK'} />
            </RowGroup>
        </Root>

    )
}