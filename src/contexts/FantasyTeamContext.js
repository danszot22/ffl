import { createContext, useReducer } from "react";

export const getInitialState = () => ({
    user: null,
    league: null,
    team: null,
    userToken: null,
});

export const setUser = (payload) => ({ type: "SET_USER", payload });
export const setTeam = (payload) => ({ type: "SET_TEAM", payload });
export const setLeague = (payload) => ({ type: "SET_LEAGUE", payload });
export const setUserToken = (payload) => ({ type: "SET_USERTOKEN", payload });

export function fantasyTeamReducer(state, action) {
    switch (action.type) {
        case "SET_USERTOKEN":
            return {
                ...state,
                userToken: action.payload,
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
            };
        case "SET_TEAM":
            return {
                ...state,
                team: action.payload,
            };
        case "SET_LEAGUE":
            return {
                ...state,
                league: action.payload,
            };
        default:
            return state;
    }
}

const FantasyTeamContext = createContext(getInitialState());

function FantasyTeamProvider({ children }) {
    const initialState = getInitialState();
    const [state, dispatch] = useReducer(fantasyTeamReducer, initialState);

    return (
        <FantasyTeamContext.Provider value={{ state, dispatch }}>
            {children}
        </FantasyTeamContext.Provider>
    )
}

export { FantasyTeamContext, FantasyTeamProvider };