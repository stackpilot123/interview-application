import { useDispatch, useSelector } from "react-redux";
import Navbar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { setUserInfo } from "../../features/userSlice";
import Background from "./Background";

const Candidate = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const countProfileFields = useRef(0);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "admin") {
        navigate("/admin");
      }
    }
  }, []);

  const calculatePercentage = () => {
    if (!userInfo) return;
    countProfileFields.current = 0;
    if (userInfo.username) countProfileFields.current += 1;
    if (userInfo.backstory) countProfileFields.current += 1;
    if (userInfo.combatStyle) countProfileFields.current += 1;
    if (userInfo.preferredRole) countProfileFields.current += 1;
    if (userInfo.powers[0] !== "") countProfileFields.current += 1;
    if (userInfo.keyBattles[0] !== "") countProfileFields.current += 1;
    if (userInfo.teams[0] !== "") countProfileFields.current += 1;
    if (userInfo.weaknesses[0] !== "") countProfileFields.current += 1;
  };

  useEffect(() => {
    calculatePercentage();
    console.log(countProfileFields.current)
    dispatch(
      setUserInfo({
        ...userInfo,
        profilePercentage: countProfileFields.current * 12.5,
      })
    );
    console.log(countProfileFields.current * 12.5);
  }, [
    userInfo.username,
    userInfo.backstory,
    userInfo.combatStyle,
    userInfo.keyBattles,
    userInfo.powers,
    userInfo.preferredRole,
    userInfo.teams,
    userInfo.weaknesses,
  ]);

  return (
    <>
      <Background>
        <div className="bg-black/40 md:bg-black/26">
          <div className="px-3 md:px-6 pt-3 top-0 z-50 sticky ">
            <Navbar />
          </div>
          <Outlet />
        </div>
      </Background>
    </>
  );
};

export default Candidate;
