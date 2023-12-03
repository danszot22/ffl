import { useContext, useEffect } from "react";
import { FantasyTeamContext } from "../contexts/FantasyTeamContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { dispatchTokenData } from "../utils/helpers";

export default function withAuth(Component) {
  return function (props) {
    const { dispatch, state } = useContext(FantasyTeamContext);
    const navigate = useNavigate();

    useEffect(() => {
      const checkLocalStorage = async () => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        const tokenPayLoad = jwtDecode(token);
        if (tokenPayLoad?.userName) {
          dispatchTokenData(dispatch, tokenPayLoad, token);
        }

        return true;
      };

      (async () => {
        if (!state?.user) {
          const inLocalStorage = await checkLocalStorage();
          if (!inLocalStorage) {
            navigate(`/Login`);
          }
        }
      })();
    }, [state?.userToken, state?.user, navigate, dispatch]);

    return (
      <Component
        team={state?.team}
        league={state?.league}
        user={state?.user}
        isAuthenticated={true}
        {...props}
      ></Component>
    );
  };
}
