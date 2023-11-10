import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { User, fetchingUserData } from "../../redux/userDetailsSlice";
import "../userList/UserStyles.css";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
function UserList() {
  const navigate = useNavigate();
  const { users ,loading} = useSelector((state: RootState) => state.userDetails);
  const dispatch: AppDispatch = useDispatch();
  const [hoveredUser, setHoveredUser] = useState<any>(null);
  const handleMouseOver = (user: any) => {
    setHoveredUser(user);
  };

  const handleMouseOut = () => {
    setHoveredUser(null);
  };

  useEffect(() => {
    dispatch(fetchingUserData());
  }, [dispatch]);
  const handleClick = (user: User) => {
    navigate("/UserDetails", { state: user });
  };
  return (
    <div>
      {
loading?<Loader/>:<div className="mainContainer">
<div id="mapContainer">
  {users.map((user) => (
    <div
      key={user.id}
      onMouseOver={() => handleMouseOver(user)}
      onMouseOut={handleMouseOut}
      id="userNames"
    >
      <button id="btn" onClick={() => handleClick(user)}>
        <pre>
          {user.id}.{user.name}
        </pre>
      </button>
    </div>
  ))}
</div>

{hoveredUser && (
  <div className="popup">
    <div id="popUpDescription">
      <span><span className="title">UserName:</span>{hoveredUser.username}</span>
      <span><span className="title">Email:</span>{hoveredUser.email}</span>
    </div>
  </div>
)}
</div>
      }
    </div>
  );
}

export default UserList;
