import { Box, Button, Divider, InputAdornment, TextField } from "@mui/material";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function EditPrizeSettings() {
    const { state } = useLocation();
    const [prizes, setPrizes] = useState({
        ...state.prizes,
        FirstFeePrize: state.prizes.FirstFeePrize * 100,
        SecondFeePrize: state.prizes.SecondFeePrize * 100,
        ThirdFeePrize: state.prizes.ThirdFeePrize * 100,
    });

    const handleChange = (id, value) => {
        let updatedPrizes = { ...prizes };
        updatedPrizes[id] = value;
        setPrizes(updatedPrizes);
    };

    const handleSave = (event) => {

        const updatedPrizes = {
            ...prizes,
            FirstFeePrize: prizes.FirstFeePrize / 100,
            SecondFeePrize: prizes.SecondFeePrize / 100,
            ThirdFeePrize: prizes.ThirdFeePrize / 100,
        }

        //TODO : Call API
        console.log(updatedPrizes);
    };

    return (
        <Root title={'Prize Settings'}>
            <PageToolbar title={'Prize Settings'} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 2
            }}>
                <TextField
                    id="FirstPrize"
                    label="First Prize"
                    value={prizes?.FirstPrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="SecondPrize"
                    label="Second Prize"
                    value={prizes?.SecondPrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="ThirdPrize"
                    label="Third Prize"
                    value={prizes?.ThirdPrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="WeeklyPrize"
                    label="Weekly Prize"
                    value={prizes?.WeeklyPrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="PlayoffGamePrize"
                    label="Playoff Game Prize"
                    value={prizes?.PlayoffGamePrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="FantasyBowlPrize"
                    label="Fantasy Bowl Prize"
                    value={prizes?.FantasyBowlPrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="FirstFeePrize"
                    label="First Prize From Fees"
                    value={prizes?.FirstFeePrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="SecondFeePrize"
                    label="Second Prize From Fees"
                    value={prizes?.SecondFeePrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        type: 'number',
                    }}
                />
                <TextField
                    id="ThirdFeePrize"
                    label="Third Prize From Fees"
                    value={prizes?.ThirdFeePrize}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        type: 'number',
                    }}
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
                to={`/Settings`}
            >
                Cancel
            </Button>
        </Root>
    )
}