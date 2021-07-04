import { gql } from "@apollo/client";

export const CREATE_ROOM = gql`
  mutation createRoom($input: createRoomInput!) {
    createRoom(input: $input) {
      __typename @skip(if: true)
      username
      room
    }
  }
`;

export const CREATE_TIPS = gql`
  mutation createTip($input: createTips!) {
    createTip(input: $input) {
      __typename @skip(if: true)
      username
      number
      room
    }
  }
`;

export const DELETE_ALL_TIPS = gql`
  mutation deleteAllTips($input: deleteTipsAndRoom!) {
    deleteAllTips(input: $input)
  }
`;

export const USER_OUT_ROOM = gql`
  mutation userOut($input: userOutInput!) {
    userOut(input: $input)
  }
`;
