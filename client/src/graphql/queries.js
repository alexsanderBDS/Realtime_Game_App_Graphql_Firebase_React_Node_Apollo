import { gql } from "@apollo/client";

export const GET_ALL_ROOMS = gql`
  query roomWithPlayers($input: [userOutInput]) {
    roomWithPlayers(input: $input) {
      __typename @skip(if: true)
      playersInRoom {
        __typename @skip(if: true)
        username
        room
      }
    }
  }
`;

export const GET_MY_ROOM = gql`
  query myRoom($input: userOutInput!) {
    myRoom(input: $input) {
      __typename @skip(if: true)
      username
      room
    }
  }
`;

export const GET_ROOMS_NO_FILTER = gql`
  query {
    rooms {
      __typename @skip(if: true)
      username
      room
    }
  }
`;

export const GET_MY_TIPS = gql`
  query myTips($input: userOutInput!) {
    myTips(input: $input) {
      __typename @skip(if: true)
      username
      room
      number
    }
  }
`;
