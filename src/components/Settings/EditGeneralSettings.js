import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Root from "../Root";
import PageToolbar from "../common/PageToolbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditGeneralSettings() {
    const { state } = useLocation();
    const [settings, setSettings] = useState({ ...state?.settings });
    const [deadline, setDeadline] = useState(0);
    const [waiverDay, setWaiverDay] = useState(2);
    const [waiverStart, setWaiverStart] = useState(0);
    const [waiverEnd, setWaiverEnd] = useState(0);
    const [feeStart, setFeeStart] = useState(0);
    const [feeEnd, setFeeEnd] = useState(0);
    const [unlimitedStart, setUnlimitedStart] = useState(0);
    const [unlimitedEnd, setUnlimitedEnd] = useState(0);
    const [waivers, setWaivers] = useState(false);
    const [keeperDrop, setKeeperDrop] = useState(false);
    const [unlimited, setUnlimited] = useState(false);

    useEffect(() => {
        setDeadline(settings?.LineupDeadline);
        setWaiverDay(settings?.WaiverProcessDay);
        setWaiverStart(settings?.WaiversFromWeek);
        setWaiverEnd(settings?.WaiversToWeek);
        setFeeStart(settings?.AddDropFeeFromWeek);
        setFeeEnd(settings?.AddDropFeeToWeek);
        setUnlimitedStart(settings?.UnlimitedAddDropsFromWeek);
        setUnlimitedEnd(settings?.UnlimitedAddDropsToWeek);
        setUnlimited(settings?.UnlimitedAddDrops);
        setKeeperDrop(settings?.AllowDropEligibleKeeper);
        setWaivers(settings?.Waivers);
    }, [settings]);

    const handleSave = (event) => {
        //TODO : Call API
        console.log(settings);
    };

    const handleChange = (id, value) => {
        const updateSettings = {
            ...settings,
            [id]: value
        };

        setSettings(updateSettings);
    };

    return (
        <Root title={'General Settings'}>
            <PageToolbar title={'General Settings'} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 2
            }}>
                <TextField
                    id="LeagueName"
                    label="League Name"
                    value={settings?.LeagueName}
                    onChange={(event) => handleChange(event.target.id, event.target.value)}
                />
                <TextField
                    id="EntryFee"
                    label="Entry Fee"
                    value={settings?.EntryFee}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <FormControl fullWidth>
                    <InputLabel id="lineup-deadlines-select-label">Lineup DeadLines</InputLabel>
                    <Select
                        labelId="lineup-deadlines-select-label"
                        id="LineupDeadline"
                        value={deadline}
                        label="Lineup DeadLines"
                        onChange={(event) => handleChange("LineupDeadline", event.target.value)}
                    >
                        <MenuItem value={0}>First Game of Every Week</MenuItem>
                        <MenuItem value={1}>Sunday 1:00 PM (except Thursday and Saturday Games)</MenuItem>
                        <MenuItem value={2}>Game Time of Each Player</MenuItem>
                    </Select>
                </FormControl>
                <Divider>Waiver Settings</Divider>
                <FormGroup>
                    <FormControlLabel control={<Checkbox name='useWaivers' onChange={(event) => handleChange("Waivers", event.target.checked)} checked={waivers} />} label="Use Waivers" />
                </FormGroup>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    gap: 3,
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="waiver-start-select-label">Waiver Start</InputLabel>
                        <Select
                            labelId="waiver-start-select-label"
                            id="waiver-start-select"
                            value={waiverStart}
                            label="Waiver Start"
                            onChange={(event) => handleChange("WaiversFromWeek", event.target.value)}
                        >
                            {[...Array(19).keys()].map((i) => <MenuItem key={`waiver-start-${i}`} value={i}>{i === 0 ? `Season Start` : i === 18 ? `Season End` : `First Game Week ${i}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormHelperText>to</FormHelperText>
                    <FormControl fullWidth>
                        <InputLabel id="waiver-end-select-label">Waiver End</InputLabel>
                        <Select
                            labelId="waiver-end-select-label"
                            id="WaiversToWeek"
                            value={waiverEnd}
                            label="Waiver End"
                            onChange={(event) => handleChange("WaiversToWeek", event.target.value)}
                        >
                            {[...Array(19).keys()].map((i) => <MenuItem key={`waiver-end-${i}`} value={i}>{i === 0 ? `Season Start` : i === 18 ? `Season End` : `First Game Week ${i}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    gap: 3,
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="waiver-process-day-select-label">Process Waivers Every</InputLabel>
                        <Select
                            labelId="waiver-process-day-select-label"
                            id="WaiverProcessDay"
                            value={waiverDay}
                            label="Waiver Process Day"
                            onChange={(event) => handleChange("WaiverProcessDay", +event.target.value)}
                        >
                            <MenuItem value={2}>Tuesday</MenuItem>
                            <MenuItem value={3}>Wednesday</MenuItem>
                            <MenuItem value={4}>Thursday</MenuItem>
                        </Select>
                    </FormControl>
                    <FormHelperText>@</FormHelperText>
                    <TextField
                        id="WaiverProcessTime"
                        label="Process Time"
                        value={settings?.WaiverProcessTime}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                </Box>
                <Divider>Unlimited Add/Drop Settings</Divider>
                <FormGroup>
                    <FormControlLabel control={<Checkbox name='unlimitedAddDrops' checked={unlimited} onChange={(event) => handleChange("UnlimitedAddDrops", event.target.checked)} />} label="Enable Unlimited Add/Drops" />
                </FormGroup>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    gap: 3,
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="unlimited-start-select-label">Unlimited Start</InputLabel>
                        <Select
                            labelId="unlimited-start-select-label"
                            id="UnlimitedAddDropsFromWeek"
                            value={unlimitedStart}
                            label="Unlimited Start"
                            onChange={(event) => handleChange("UnlimitedAddDropsFromWeek", event.target.value)}
                        >
                            {[...Array(19).keys()].map((i) => <MenuItem key={`unlimited-start-${i}`} value={i}>{i === 0 ? `Season Start` : i === 18 ? `Season End` : `Sunday Week ${i}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormHelperText>to</FormHelperText>
                    <FormControl fullWidth>
                        <InputLabel id="unlimited-end-select-label">Unlimited End</InputLabel>
                        <Select
                            labelId="unlimited-end-select-label"
                            id="UnlimitedAddDropsToWeek"
                            value={unlimitedEnd}
                            label="Unlimited End"
                            onChange={(event) => handleChange("UnlimitedAddDropsToWeek", event.target.value)}
                        >
                            {[...Array(19).keys()].map((i) => <MenuItem key={`unlimited-end-${i}`} value={i}>{i === 0 ? `Season Start` : i === 18 ? `Season End` : `Sunday Week ${i}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Divider>Trade Settings</Divider>
                <TextField
                    id="AutoApproveTradesInDays"
                    label="Auto Approve Trade in Days"
                    value={settings?.AutoApproveTradesInDays}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        type: 'number',
                    }}
                />
                <TextField
                    id="TradeCompletionLeadTimeInHours"
                    label="Trade Lead Time In Hours"
                    value={settings?.TradeCompletionLeadTimeInHours}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        type: 'number',
                    }}
                />
                <TextField
                    id="TradesExpireInDays"
                    label="Trade Expire Time in Days"
                    value={settings?.TradesExpireInDays}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        type: 'number',
                    }}
                />
                <Divider>Add/Drop Fee Settings</Divider>
                <TextField
                    id="AddDropFee"
                    label="Add/Drop Fee"
                    value={settings?.AddDropFee}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        type: 'number',
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    gap: 3,
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="fee-start-select-label">Fee Start</InputLabel>
                        <Select
                            labelId="fee-start-select-label"
                            id="AddDropFeeFromWeek"
                            value={feeStart}
                            label="Fee Start"
                            onChange={(event) => handleChange("AddDropFeeFromWeek", event.target.value)}
                        >
                            {[...Array(19).keys()].map((i) => <MenuItem key={`fee-start-${i}`} value={i}>{i === 0 ? `Season Start` : i === 18 ? `Season End` : `Sunday Week ${i}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormHelperText>to</FormHelperText>
                    <FormControl fullWidth>
                        <InputLabel id="fee-end-select-label">Fee End</InputLabel>
                        <Select
                            labelId="fee-end-select-label"
                            id="AddDropFeeToWeek"
                            value={feeEnd}
                            label="Fee End"
                            onChange={(event) => handleChange("AddDropFeeToWeek", event.target.value)}
                        >
                            {[...Array(19).keys()].map((i) => <MenuItem key={`fee-end-${i}`} value={i}>{i === 0 ? `Season Start` : i === 18 ? `Season End` : `Sunday Week ${i}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Divider>Keeper Settings</Divider>
                <TextField
                    id="KeeperRound"
                    label="Keeper Round"
                    value={settings?.KeeperRound}
                    onChange={(event) => handleChange(event.target.id, +event.target.value)}
                    InputProps={{
                        type: 'number',
                    }}
                />
                <FormGroup>
                    <FormControlLabel control={<Checkbox name='allowKeeperDrop' checked={keeperDrop} onChange={(event) => handleChange("AllowDropEligibleKeeper", event.target.checked)} />} label="Allow Keepers Drop" />
                </FormGroup>
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