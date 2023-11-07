import { Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";
import { formatPlayerFullName } from "../../utils/helpers";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Menu from '@mui/icons-material/Menu';
import Delete from "@mui/icons-material/Delete";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function TeamWaiverRequests({ waiverRequests, team, onDragEnd, handleDelete }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <List ref={provided.innerRef} {...provided.droppableProps}>
                        <ListSubheader>
                            <Typography sx={{ fontWeight: 700, }}>
                                {team?.TeamName} - {team?.OwnerName}
                            </Typography>
                        </ListSubheader>
                        {waiverRequests?.map((waiverRequest, index) => (
                            <Draggable
                                key={waiverRequest.WaiverRequestId}
                                index={index}
                                draggableId={waiverRequest.WaiverRequestId + ''}
                            >
                                {(provided, snapshot) => (
                                    <ListItem sx={{ m: 1, border: 1 }}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            // default item style
                                            padding: '8px 16px',
                                            // default drag style
                                            ...provided.draggableProps.style,
                                            // customized drag style
                                            background: snapshot.isDragging
                                                ? prefersDarkMode ? 'gray' : 'white'
                                                : 'transparent',
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Menu />
                                        </ListItemIcon>
                                        <ListItemText sx={{ maxWidth: 50, pr: 2 }}>
                                            {index + 1}.
                                        </ListItemText>
                                        <ListItemText >
                                            {` Add `}
                                            <Link to={`/Player/${waiverRequest.PlayerToAdd.PlayerId}`} >
                                                {formatPlayerFullName(waiverRequest.PlayerToAdd.Name, waiverRequest.PlayerToAdd.Position.PositionCode)}
                                            </Link>
                                            {` ${waiverRequest.PlayerToAdd.Position.PositionCode} ${waiverRequest.PlayerToAdd.NflTeam.DisplayCode}`}
                                            {` drop `}
                                            <Link to={`/Player/${waiverRequest.RosterPlayerToDelete.Player.PlayerId}`} >
                                                {formatPlayerFullName(waiverRequest.RosterPlayerToDelete.Player.Name, waiverRequest.RosterPlayerToDelete.Player.Position.PositionCode)}
                                            </Link>
                                            {` ${waiverRequest.RosterPlayerToDelete.Player.Position.PositionCode} ${waiverRequest.RosterPlayerToDelete.Player.NflTeam.DisplayCode}`}
                                        </ListItemText>
                                        <ListItemButton sx={{ maxWidth: 50 }}>
                                            <ListItemIcon onClick={() => handleDelete(waiverRequest.WaiverRequestId)}>
                                                <Delete />
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </List>
                )
                }
            </Droppable>
        </DragDropContext>
    )
}