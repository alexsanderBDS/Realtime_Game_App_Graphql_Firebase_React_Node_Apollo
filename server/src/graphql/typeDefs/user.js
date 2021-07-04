const { gql } = require("apollo-server-express");

module.exports = gql`
  input createRoomInput {
    username: String!
    room: String!
  }

  type Tips {
    username: String!
    room: String!
    number: Int!
  }

  input createTips {
    username: String
    room: String
    number: Int
  }

  input deleteTipsAndRoom {
    room: String!
  }

  input userOutInput {
    username: String!
    room: String!
  }

  type RoomComplete {
    playersInRoom: [Room!]!
  }

  type Room {
    username: String!
    room: String!
  }

  type Query {
    myRoom(input: userOutInput!): [Room!]!
    rooms: [Room!]!
    roomWithPlayers(input: [userOutInput]): [RoomComplete!]!
    tips: [Tips!]!
    myTips(input: userOutInput!): [Tips!]!
  }

  type Mutation {
    createRoom(input: createRoomInput!): Room!
    createTip(input: createTips!): Tips!
    deleteAllTips(input: deleteTipsAndRoom!): String!
    deleteRoom(input: deleteTipsAndRoom!): String!
    userOut(input: userOutInput!): String!
  }

  type Subscription {
    roomCreated: Room!
    tipCreated(input: userOutInput!): Tips
    userExit: String
  }
`;
