import Root from "../Root";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, TextField, useMediaQuery, useTheme } from "@mui/material";
import PageToolbar from "../common/PageToolbar";

export default function EditRosterSettings() {
    const theme = useTheme();
    const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

    const { state } = useLocation();
    const [settings, setSettings] = useState({ ...state.settings });
    const [fields, setFields] = useState([]);
    const [labels, setLabels] = useState([]);
    const [TMQB, setTMQB] = useState(false);
    const [TMPK, setTMPK] = useState(false);
    const [TE, setTE] = useState(false);

    const handleSave = (event) => {
        //TODO : Call API
        console.log(settings);
    };

    const handleChangeQB = (enablingTeamQB) => {
        const updatedSettings = {
            ...settings,
            QB: enablingTeamQB ? 0 : settings.TMQB,
            TMQB: enablingTeamQB ? settings.QB : 0,
            SQB: enablingTeamQB ? 0 : settings.STMQB,
            STMQB: enablingTeamQB ? settings.SQB : 0,
        };
        setSettings(updatedSettings);
    };

    const handleChangePK = (enablingTeamPK) => {
        const updatedSettings = {
            ...settings,
            PK: enablingTeamPK ? 0 : settings.TMPK,
            TMPK: enablingTeamPK ? settings.PK : 0,
            SPK: enablingTeamPK ? 0 : settings.STMPK,
            STMPK: enablingTeamPK ? settings.SPK : 0,
        };
        setSettings(updatedSettings);
    };

    const handleChangeTE = (includingTE) => {
        const updatedSettings = {
            ...settings,
            WR: includingTE ? 0 : settings.R,
            R: includingTE ? settings.WR : 0,
            SWR: includingTE ? 0 : settings.SR,
            SR: includingTE ? settings.SWR : 0,
        };
        setSettings(updatedSettings);
    };

    const handleChange = (id, value) => {
        if ((id === "QB" && TMQB) || (id === "PK" && TMPK))
            id = "TM" + id;
        else if ((id === "SQB" && TMQB) || (id === "SPK" && TMPK))
            id = "STM" + id;
        else if (id === "WR" && TE)
            id = "R";
        else if (id === "SWR" && TE)
            id = "R";
        const updatedSettings = {
            ...settings,
            [id]: value
        };
        setSettings(updatedSettings);
    };

    useEffect(() => {
        const editFields = Object.entries(settings).filter((setting) => !["SRBWR", "TMQB", "STMQB", "R", "SR", "TMPK", "STMPK"].includes(setting[0]));
        setFields(editFields);
        setLabels(['Quarterbacks', 'Starting Quarterbacks',
            'Running Backs', 'Starting Running Backs',
            'Wide Receivers', 'Starting Wide Receivers',
            'Tight Ends', 'Starting Tight Ends',
            'Kickers', 'Starting Kickers',
            'Defensive Players', 'Starting Defensive Players',
            'Team Defense', 'Starting Team Defense',
            'Linebackers', 'Starting Linebackers',
            'Cornerbacks', 'Starting Cornerbacks',
            'Safeties', 'Starting Safeties',
            'Defensive Backs', 'Starting Defensive Backs',
            'Defensive Ends', 'Starting Defensive Ends',
            'Defensive Tackles', 'Starting Defensive Tackles',
            'Defensive Lineman', 'Starting Defensive Lineman', 'Utility']);
        setTMQB(settings.TMQB > 0);
        setTMPK(settings.TMPK > 0);
        setTE(settings.R > 0);
    }, [settings]);

    return (
        <Root title={'League Roster Settings'} >
            <PageToolbar title={'League Roster Settings'} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    textAlign: 'center',
                    flexGrow: 1,
                    mt: 2
                }}>
                {fields.map((field, index) => {
                    return index % 2 === 0 ?
                        <Box key={index} sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            textAlign: 'center',
                            flexGrow: 1,
                        }}>
                            <TextField
                                sx={{ width: isBelowMedium ? 125 : 250 }}
                                id={fields[index][0]}
                                label={labels[index]}
                                value={fields[index][0] === "QB" ? (TMQB ? settings.TMQB : field[1]) :
                                    fields[index][0] === "PK" ? (TMPK ? settings.TMPK : field[1]) :
                                        fields[index][0] === "WR" ? (TE ? settings.R : field[1]) :
                                            field[1]
                                }
                                onChange={(event) => handleChange(event.target.id, +event.target.value)}
                                disabled={fields[index][0] === "TE" && TE}
                            />
                            {index !== fields.length - 1 ?
                                <TextField
                                    sx={{ width: isBelowMedium ? 100 : 250 }}
                                    id={fields[index + 1][0]}
                                    label={fields[index + 1] ? labels[index + 1] : ' '}
                                    value={fields[index][0] === "QB" ? settings.STMQB + fields[index + 1][1] :
                                        fields[index][0] === "PK" ? settings.STMPK + fields[index + 1][1] :
                                            fields[index][0] === "WR" ? settings.SR + fields[index + 1][1] :
                                                fields[index + 1][1]
                                    }
                                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                                    disabled={fields[index][0] === "TE" && TE}
                                />
                                :
                                null
                            }
                            {["QB"].includes(fields[index][0]) ?
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox name='TMQB' checked={TMQB} onChange={() => handleChangeQB(!TMQB)} />} label={isBelowMedium ? "Team QB" : "Team Quarterbacks"} />
                                </FormGroup> :
                                ["PK"].includes(fields[index][0]) ?
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox name='TMPK' checked={TMPK} onChange={() => handleChangePK(!TMPK)} />} label={isBelowMedium ? "Team PK" : "Team Kickers"} />
                                    </FormGroup> :
                                    ["WR"].includes(fields[index][0]) ?
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox name='TE' checked={TE} onChange={() => handleChangeTE(!TE)} />} label={isBelowMedium ? "Incl TE" : "Include Tight Ends"} />
                                        </FormGroup> :
                                        <FormGroup sx={{ width: 100 }}>

                                        </FormGroup>
                            }
                        </Box>
                        :
                        null
                }
                )}
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