import { useEffect, useState } from "react";
import Root from "../Root";
import withAuth from "../withAuth";
import { userLoader } from "../../api/graphql";
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, TextField } from "@mui/material";
import PageToolbar from "../common/PageToolbar";
import { useNavigate } from "react-router-dom";

function Account({ user }) {
    const [accountDetails, setAccountDetails] = useState();
    const [emailIR, setEmailIR] = useState(false);
    const [emailStats, setEmailStats] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (accountDetails) {
            setEmailIR(accountDetails?.Email_IR);
            setEmailStats(accountDetails?.Email_Stats);
        }
    }, [accountDetails]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await userLoader(user?.userName);
            setAccountDetails(response);
        }
        fetchData();
    }, [user?.userName]);

    const handleSave = (event) => {
        //TODO : Call API
        console.log(accountDetails);
        navigate(-1);
    };

    const handleChange = (id, value) => {
        const updateAccount = {
            ...accountDetails,
            [id]: value
        };

        setAccountDetails(updateAccount);
    };

    return (
        <Root title={'Account Profile'}>
            <PageToolbar title={'Account Profile'} />
            {accountDetails ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 2
                }}>
                    <TextField
                        id="FirstName"
                        label="First Name"
                        value={accountDetails?.FirstName}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="LastName"
                        label="Last Name"
                        value={accountDetails?.LastName}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="Address1"
                        label="Address Line 1"
                        value={accountDetails?.Address1}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="Address2"
                        label="Address Line 2"
                        value={accountDetails?.Address2}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="City"
                        label="City"
                        value={accountDetails?.City}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="State"
                        label="State"
                        value={accountDetails?.State}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="Zip"
                        label="Zip"
                        value={accountDetails?.Zip}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="Phone"
                        label="Phone"
                        value={accountDetails?.Phone}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <TextField
                        id="Email"
                        label="Email"
                        value={accountDetails?.Email}
                        onChange={(event) => handleChange(event.target.id, event.target.value)}
                    />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox name='emailIR' checked={emailIR} onChange={(event) => handleChange("Email_IR", event.target.checked)} />} label="Email me when my players go on IR" />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox name='emailStats' checked={emailStats} onChange={(event) => handleChange("Email_Stats", event.target.checked)} />} label="Email me when weekly stats are run" />
                    </FormGroup>
                </Box>
                : null}
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
        </Root>
    )
}

export default withAuth(Account);