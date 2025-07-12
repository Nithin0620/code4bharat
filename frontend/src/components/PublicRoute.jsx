import { Navigate } from "react-router-dom";
import useAuthStore from "../ZustandStore/Auth";


const PublicRoute = ({ children }) => {

   const {isAuthenticated} = useAuthStore();
   if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
   }
   if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
   }
  return children;
};


export default PublicRoute