import React, { useEffect, useState } from "react";
import { Prompt, useParams } from "react-router-dom";
import styled from "styled-components";
import { useBeforeunload } from "react-beforeunload";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_MY_ROOM, GET_MY_TIPS } from "../../graphql/queries";
import {
  CREATE_TIPS,
  DELETE_ALL_TIPS,
  USER_OUT_ROOM,
} from "../../graphql/mutations";
import { ToastContainer, toast } from "react-toastify";
import { TIP_CREATED } from "../../graphql/subscriptions";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  .change {
    color: black !important;
    border-radius: 10px;
    letter-spacing: 10px;
  }
`;

const DivHands = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: "white";
  margin: "auto";
  padding: "1rem";
  borderradius: "20px";
  gap: 2rem;
  justify-content: center;

  i {
    font-size: "8rem";
  }

  i:hover {
    color: rgb(46, 83, 100);
    cursor: pointer;
  }
`;

const Welcome = () => {
  let { params } = useParams();
  let url = new URLSearchParams(params);
  // const [value, setValue] = useState(0);
  const [label, setLabel] = useState("...");
  const [number, setNumber] = useState(0);
  const [btn, setBtn] = useState(true);
  const [message, setMessage] = useState("Choose one.");
  // let history = useHistory();

  const username = url.get("username");
  const room = url.get("room");

  useSubscription(TIP_CREATED, {
    variables: {
      input: {
        username,
        room,
      },
    },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (data.tipCreated) {
        setMessage(`${data.tipCreated.username} has played!`);

        // toast.info(JSON.stringify(data.tipCreated.username), {
        //   toastId: "hello",
        // });
      }
    },
  });

  const { data, startPolling, stopPolling } = useQuery(GET_MY_ROOM, {
    variables: {
      input: {
        username,
        room,
      },
    },
  });

  const [createTip] = useMutation(CREATE_TIPS);
  const [deleteAllTips] = useMutation(DELETE_ALL_TIPS, {
    variables: {
      input: {
        room,
      },
    },
  });

  const {
    data: getTips,
    startPolling: gameStart,
    stopPolling: gameStop,
  } = useQuery(GET_MY_TIPS, {
    variables: {
      input: {
        username,
        room,
      },
    },
  });

  const [userOut] = useMutation(USER_OUT_ROOM);

  useEffect(() => {
    gameStart(1000);
    return () => gameStop();
  }, [gameStart, gameStop]);

  useEffect(() => {
    if (data && data.myRoom.length <= 2) {
      startPolling(1000);
    }
    return () => stopPolling();
  }, [data, startPolling, stopPolling]);

  useEffect(() => {
    if (getTips && getTips.myTips.length === 2) {
      try {
        async function refreshTips() {
          await deleteAllTips()
            .then(() => {
              setMessage("Choose one");
            })
            .catch((error) => {
              toast.error(error);
            });
        }

        refreshTips();
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [getTips, deleteAllTips]);

  useBeforeunload((e) => {
    e.preventDefault();
    console.log("Não");
  });

  const handleClick = () => {
    setBtn(true);

    createTip({
      variables: {
        input: {
          username,
          room,
          number,
        },
      },
    })
      .then((res) => {
        setBtn(false);
      })
      .catch((error) => {
        toast.warn(error.message);
        setBtn(false);
      });
  };

  const exitMiddleware = async (location, action) => {
    if (action === "PUSH") {
      try {
        await userOut({
          variables: {
            input: {
              username,
              room,
            },
          },
        });
      } catch (error) {
        console.log(error.message);
      }
    }

    return false;
  };

  return (
    <Div>
      <ToastContainer />
      <Prompt when={true} message={exitMiddleware} />
      <h1 className="text-center mt-2">
        Welcome {username} ! {room} room
      </h1>
      {message}
      {data && data.myRoom.length === 2 && (
        <DivHands style={{ fontSize: "8rem" }}>
          <i
            className="far fa-hand-rock"
            onMouseOver={() => {
              setLabel("Rock");
              setNumber(1);
              setBtn(false);
            }}
          ></i>
          <i
            className="far fa-hand-spock"
            onMouseOver={() => {
              setLabel("Paper");
              setNumber(2);
              setBtn(false);
            }}
          ></i>
          <i
            className="far fa-hand-scissors"
            onMouseOver={() => {
              setLabel("Scissor");
              setNumber(3);
              setBtn(false);
            }}
          ></i>
        </DivHands>
      )}
      <div>
        {data && data.myRoom.length < 2 ? (
          <h2 className="alert alert-secondary change">
            Aguardando outro player
          </h2>
        ) : (
          <h2 className="alert alert-secondary change">
            {label}&nbsp;
            <button
              disabled={btn}
              className="btn btn-dark"
              onClick={handleClick}
            >
              Confirmar
            </button>
          </h2>
        )}
      </div>
    </Div>
  );
};

export default Welcome;
