
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../userDetails/UserDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPost,
  handleAdd,
  handleDelete,
  handleUpdate,
  handleUpdateComment,
  handleonChange,
  upDatePost,
} from "../../redux/userDetailsSlice";
import { AppDispatch, RootState } from "../../redux/store";
function UserDetails() {
  const { state } = useLocation();
  const [showPosts, setShowPosts] = useState(false);
  const [showAlbums, setShowAlbums] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [albumId, setAlbumId] = useState<null|number>(null);
  const { post, comment, updateStatus, albums} = useSelector(
    (state: RootState) => state.userDetails
  );
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPost(state.userId));
    dispatch(upDatePost(state.userId));
  }, [dispatch,state.userId]);
  const togglePosts = () => {
    setShowPosts(!showPosts);
  };

  const toggleAlbums = () => {
    setShowAlbums(!showAlbums);
  };
  const handlePhotos = async (id:number, ind:number) => {
    setAlbumId(ind);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/photos"
      );
      const data = await response.json();
      const filterData = data.filter((ele:{albumId:number}) => ele.albumId === id);
      setPhotos(filterData);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* User Profile Section */}
      <section>
        <img
          src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          className="profileImg"
          alt="Not Found"
        />
        <div>
          <pre>Name: {state.username}</pre>
          <pre>Email: {state.email}</pre>
        </div>
      </section>
      {/* User Posts Section (Collapsed by Default) */}
      <section>
        <div id="header">
          <h2 style={{ textAlign: "center" }}>User Posts</h2>
          <button onClick={togglePosts} id={showPosts?"toggleButtondisable":"toggleButtonenable"}>
            {showPosts ? "Close" : "Open"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            {showPosts && (
              // Expandable Post Section id='inputContainer'
              <div>
                <input
                  type="text"
                  value={comment}
                  onChange={({ target: { value } }) =>
                    dispatch(handleonChange(value))
                  }
                  placeholder="Create New Post..."
                className="inp"/>
                <button
                  onClick={() =>
                    updateStatus
                      ? dispatch(handleUpdateComment(state.userId))
                      : dispatch(handleAdd(state.userId))
                  }
              className={updateStatus?"add-btnenable":"add-btndisable"} >
                  {updateStatus ? "UpdateComment" : "Create Comment"}
                </button>
              </div>
            )}
          </div>
          {/* Post List with Comments */}

          <div id="mapMainContainer">
            {showPosts &&
              post?.map((ele) => {
                return (
                  <div id="maprenderedContainer" key={ele.id}>
                    <span> Title:{ele.title}</span>
                    <span> Body:{ele.body}</span>
                    <div id="renderBtns">
                      <button onClick={() => dispatch(handleUpdate(ele.id))} className="update-btn">
                        Update
                      </button>
                      <button onClick={() => dispatch(handleDelete(ele.id))} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      {/* User Albums Section (Collapsed by Default) */}
      <section>
        <div id="header">
          <h2 style={{ textAlign: "center" }}>User Albums</h2>
          <button onClick={toggleAlbums} id={showAlbums?"toggleButtondisable":"toggleButtonenable"}>
            {showAlbums ? "Close" : "Open"}
          </button>
        </div>

        {/* Album Details */}
        {showAlbums && (
          <div className="grid-container">
            {albums.map((ele, index) => {
              return (
                <button
                  key={ele.id}
                  className="grid-item"
                  onClick={() => handlePhotos(ele.userId, index+1)}
                >
                  <div className="mapContainer">
                    <img
                      src="https://img.freepik.com/free-vector/open-folder-with-documents_1262-4574.jpg?size=626&ext=jpg"
                      alt="Not Found"
                      id="folderIcon"
                    />
                    <h4>{index + 1}</h4>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        <div>
          {showAlbums && (
            <h1 style={{ textAlign: "center" }}>Photos:AlbumID_{albumId}</h1>
          )}
          {showAlbums && (
            <div className="grid-container">
              {photos.map((ele:{url:string}) => {
                return (
                  <div className="grid-item">
                    <img src={ele.url} alt="" id="photos" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default UserDetails;
