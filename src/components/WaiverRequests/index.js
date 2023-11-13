import { useEffect, useState } from "react";
import Root from "../Root";
import { teamLoader, teamWaiverRequestsLoader } from "../../api/graphql";
import TeamWaiverRequests from "./TeamWaiverRequests";
import PageToolbar from "../common/PageToolbar";
import withAuth from "../withAuth";

function WaiverRequests({ team }) {
    const [waivers, setWaivers] = useState([]);
    const [teamDetails, setTeamDetails] = useState({});

    useEffect(() => {
        const fetchTeam = async (teamId) => {
            const teamResponse = await teamLoader(teamId);
            setTeamDetails(teamResponse);
            const waiverResponse = await teamWaiverRequestsLoader(teamId, 2);
            setWaivers(waiverResponse);
        }
        fetchTeam(team?.TeamId);
    }, [
        team?.TeamId,
    ]);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const handleDragEnd = ({ destination, source }) => {
        // reorder list
        if (!destination) return;

        setWaivers(reorder(waivers, source.index, destination.index));

        //TODO : Call API
    };

    const handleDelete = (id) => {
        const updatedWaivers = waivers.filter((waiver) => {
            return waiver.WaiverRequestId !== id;
        });
        setWaivers(updatedWaivers);

        //TODO : Call API
    };

    return (
        <Root title={'Waiver Requests'}>
            <PageToolbar title={'Waiver Requests'} />
            <div style={{ width: '100%' }}>
                <TeamWaiverRequests waiverRequests={waivers} team={teamDetails} onDragEnd={handleDragEnd} handleDelete={handleDelete} />
            </div>
        </Root>
    )
}

export default withAuth(WaiverRequests);