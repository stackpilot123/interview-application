import { useEffect, useState } from "react";
import { Auth, Notify } from ".";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/apiClient";
import { GET_USER_INFO } from "../utils/constants";
import { setUserInfo } from "../features/userSlice";
import Loader from "./utility/Loader";

const Layout = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoading = useSelector((state) => state.loader.loading.isLoading);
  const navigate = useNavigate();

  const notify = useSelector((state) => state.notify.notify);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data.user);
          dispatch(setUserInfo(response.data.user));
          // if(response.data.user.role === "candidate"){
          //     navigate("/candidate");
          // } else{
          //     navigate("admin");
          // }
        } else {
          dispatch(setUserInfo(null));
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/auth");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      {notify.message && <Notify />}
      {isLoading && <Loader />}
      <Outlet />
    </>
  );
};

export default Layout;
