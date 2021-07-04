import { gql } from "@apollo/client";

export const ROOM_CREATED = gql`
  subscription {
    roomCreated {
      username
      room
      __typename @skip(if: true)
    }
  }
`;

export const TIP_CREATED = gql`
  subscription tipCreated($input: userOutInput!) {
    tipCreated(input: $input) {
      username
      number
      room
      __typename @skip(if: true)
    }
  }
`;
