import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { GET_ALL_ROOMS } from "../../graphql/queries";

const BlinkText = styled.p`
  animation: opacity 1.5s ease-in-out infinite;
  opacity: 1;
  @keyframes opacity {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }
`;

const AllRooms = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  align-items: center;
  justify-items: center;
  gap: 1rem;
  margin: 2rem;
`;

const RoomsLoop = () => {
  const {
    data = "",
    loading = false,
    startPolling,
    stopPolling,
  } = useQuery(GET_ALL_ROOMS);
  let history = useHistory();
  useEffect(() => {
    startPolling(1000);

    if (data && data.roomWithPlayers.length < 1) {
      history.push("/");
    }

    return () => stopPolling();
  }, [data, history, startPolling, stopPolling]);

  const goToRoom = (roomName) => {
    window.localStorage.setItem("picked-room", roomName);
    history.push("/");
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1 className="text-center mt-2" onClick={() => stopPolling()}>
        Rooms
      </h1>
      <AllRooms>
        {data.roomWithPlayers.map((room, i) => {
          if (room.playersInRoom[0].room !== "admin") {
            return (
              <div key={i} className="card" style={{ width: "180px" }}>
                <div className="card-body">
                  <h5 className="card-title">{room.playersInRoom[0].room}</h5>
                  <h6>Players:</h6>
                  <ul className="card-text">
                    <li>{room.playersInRoom[0].username}</li>
                    <li>
                      {room.playersInRoom[1] ? (
                        room.playersInRoom[1].username
                      ) : (
                        <BlinkText>{"Waiting ..."}</BlinkText>
                      )}
                    </li>
                  </ul>
                  <button
                    onClick={() => goToRoom(room.playersInRoom[0].room)}
                    className="btn btn-primary"
                    disabled={room.playersInRoom[1] ? true : false}
                  >
                    Enter
                  </button>
                </div>
              </div>
            );
          }
          return "";
        })}
      </AllRooms>
    </>
  );
};

const Rooms = () => {
  useEffect(() => {
    return () => "";
  }, []);

  return <RoomsLoop />;
};

export default Rooms;
