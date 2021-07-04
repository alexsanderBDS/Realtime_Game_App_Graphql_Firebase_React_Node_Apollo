const { db } = require("../../firebase");
const { withFilter } = require("apollo-server-express");

const NEW_ROOM = "NEW ROOM CREATED/UPDATED";
const NEW_TIP = "NEW TIP CREATED";
const USER_EXIT = "USER HAS EXIT THE ROOM";

const getValues = async function (roomName = "") {
  const values = await db.collection("rooms").get();

  const all = values.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });

  if (!roomName) {
    return all;
  }

  return all.filter((value) => {
    return value.room === roomName;
  });
};

const getTips = async function (roomName = "") {
  const values = await db.collection("tips").get();

  const all = values.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });

  if (!roomName) {
    return all;
  }

  return all.filter((value) => {
    return value.room === roomName;
  });
};

const setTips = async function (args) {
  return await db.collection("tips").add(args);
};

const deleteTips = async function (id) {
  await db.collection("tips").doc(id).delete();
};

const setValues = async function (args) {
  await db.collection("rooms").add(args);
};

const updateValues = async function (id, data) {
  await db.collection("rooms").doc(id).set(data);
};

const deleteValues = async function (id) {
  await db.collection("rooms").doc(id).delete();
};

const rooms = async (parent, args) => {
  try {
    const values = await getValues();
    return values;
  } catch (error) {
    throw new Error(error.message);
  }
};

const myRoom = (parent, args) => {
  return getValues(args.input.room);
};

const tips = (parent, args) => {
  return getTips();
};

const myTips = (parent, args) => {
  return getTips(args.input.room);
};

const createRoom = async (parent, args, { pubsub }) => {
  let thereIsArgsPlayerAndRoom =
    args.input.username && args.input.room ? true : false;

  const values = await getValues(args.input.room);

  if (!thereIsArgsPlayerAndRoom) {
    throw new Error("username and room are required!");
  }

  if (values.length < 2) {
    if (values.find((one) => one.username === args.input.username)) {
      throw new Error("Username already taken!");
    }

    setValues({ ...args.input });
    pubsub.publish(NEW_ROOM, { roomCreated: { ...args.input } });

    return { ...args.input };
  } else {
    throw new Error("Please create another room, this already has 2 players");
  }
};

const createTip = async (parent, args, { pubsub }) => {
  // find a array with the room in args

  const rooms = await getValues(args.input.room);
  const values = await getTips(args.input.room);

  const exist = rooms.find((one) => one.room === args.input.room);
  if (!exist) {
    throw new Error("Room does not exist!");
  }

  const { length } = rooms;

  if (length < 2) {
    throw new Error("Room must contain two players!");
  }

  const username = rooms.find((one) => one.username === args.input.username);
  if (!username) {
    throw new Error("Username must contain in room");
  }

  if (values.find((one) => one.username === args.input.username)) {
    throw new Error("It's not your time, wait your opponent to play...");
  }

  setTips({ ...args.input });
  pubsub.publish(NEW_TIP, { tipCreated: { ...args.input } });

  return { ...args.input };
};

const deleteAllTips = async (parent, args) => {
  // find a array with the room in args

  const values = await getTips(args.input.room);

  if (values.length > 0) {
    for (const { id } of values) {
      deleteTips(id);
    }

    return "All Tips from this room were excluded.";
  }

  throw new Error("There's no tips!");
};

const deleteRoom = async function (parent, args) {
  if (args.input) {
    const myRoom = await getValues(args.input.room);
    if (myRoom.length > 0) {
      for (const { id } of myRoom) {
        deleteValues(id);
      }

      return `Room ${args.input.room} was deleted!`;
    }
  }

  throw new Error("Room doesn't exist or not allowed!");
};

const userOut = async (parent, args, { pubsub }) => {
  const rooms = await getValues(args.input.room);

  if (rooms.length > 0) {
    const { id } = rooms.find((room) => {
      return room.username === args.input.username;
    });

    deleteValues(id);

    pubsub.publish(USER_EXIT, {
      userExit: `Player ${args.input.username} has exit.`,
    });

    return `Player ${args.input.username} has exit.`;
  }

  throw new Error("args don't match!");
};

const roomWithPlayers = async (parent, args) => {
  let rooms = await getValues();

  if (args.input) {
    rooms = args.input;
  }

  const filteredRoomName = rooms.filter((room, index, self) => {
    return (
      index ===
      self.findIndex((t) => {
        return t.room === room.room;
      })
    );
  });

  let new_array = [];
  filteredRoomName.forEach((roomName) => {
    const result = rooms.filter((room) => {
      return room.room === roomName.room;
    });
    new_array.push({ playersInRoom: result });
  });

  return new_array;
};

module.exports = {
  Query: {
    myRoom,
    rooms,
    roomWithPlayers,
    tips,
    myTips,
  },
  Mutation: { createRoom, createTip, deleteAllTips, deleteRoom, userOut },
  Subscription: {
    roomCreated: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator([NEW_ROOM]),
    },
    tipCreated: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator([NEW_TIP]),
        (payload, variables) => {
          return payload.tipCreated.room === variables.input.room;
        }
      ),
    },
    userExit: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator([USER_EXIT]);
      },
    },
  },
};
