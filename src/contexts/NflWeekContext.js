import { createContext, useReducer } from "react";

export const getInitialState = () => ({
    lineupWeek: null,
    lastScoredWeek: null
});

export const setLineupWeek = (payload) => ({ type: "SET_LINEUP_WEEK", payload });
export const setLastScoredWeek = (payload) => ({ type: "SET_LAST_SCORED_WEEK", payload });

export function NflWeekReducer(state, action) {
    switch (action.type) {
        case "SET_LINEUP_WEEK":
            return {
                ...state,
                lineupWeek: action.payload,
            };
        case "SET_LAST_SCORED_WEEK":
            return {
                ...state,
                lastScoredWeek: action.payload,
            };
        default:
            return state;
    }
}

const NflWeekContext = createContext();

function NflWeekProvider({ children }) {
    const initialState = getInitialState();
    const [state, dispatch] = useReducer(NflWeekReducer, initialState);

    return (
        <NflWeekContext.Provider value={{ state, dispatch }}>
            {children}
        </NflWeekContext.Provider>
    )
}

export { NflWeekContext, NflWeekProvider };