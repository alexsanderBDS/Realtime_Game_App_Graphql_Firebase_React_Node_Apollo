import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CREATE_ROOM } from "../graphql/mutations";

const Home = () => {
  const [value, setValue] = useState("");
  const [erro, setErro] = useState("");
  let history = useHistory();
  const [createRoom] = useMutation(CREATE_ROOM);

  useEffect(() => {
    if (window.localStorage.getItem("picked-room")) {
      setValue(window.localStorage.getItem("picked-room"));
    }

    window.localStorage.setItem("picked-room", "");
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data: dataUser } = await createRoom({
        variables: {
          input: {
            username: e.target.username.value,
            room: e.target.room.value,
          },
        },
      });

      history.push(
        `/welcome/username=${dataUser.createRoom.username}&room=${e.target.room.value}`
      );
    } catch (error) {
      setErro(error.message);

      setTimeout(() => {
        setErro("");
      }, 4000);
    }
  };

  return (
    <>
      <div
        className="p-5"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {erro && (
          <div className="alert alert-danger" role="alert">
            {erro}
          </div>
        )}
        <h1 style={{ textAlign: "center" }}>
          Create a new Room
          <br />
          or Enter in one
        </h1>
        <form type="submit" onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingUsername"
              placeholder="example: user147"
              name="username"
              required
            />
            <label htmlFor="floatingUsername">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingRoom"
              placeholder="Room Name"
              name="room"
              required
              defaultValue={value}
            />
            <label htmlFor="floatingRoom">Room Name</label>
          </div>
          <button className="btn btn-primary mt-3">Submit</button>
        </form>
      </div>
    </>
  );
};
export default Home;
