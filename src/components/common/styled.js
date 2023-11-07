import { alpha, styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Box, Paper } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

export const HeaderItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.grey[300],
    ...theme.typography.body2,
    padding: theme.spacing(0.25),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const StyledTableCellHeader1 = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.info.dark,
        color: theme.palette.common.white,
        border: 0,
        fontSize: 24,
    }
}));

export const StyledTableCellHeader2 = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        border: 0,
    }
}));

export const PageHeader = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.common.white,
    border: 0
}));

export const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const StyledExpandableTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(4n + 1)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ODD_OPACITY = 0.2;

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
    [`& .${gridClasses.row}.odd`]: {
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));