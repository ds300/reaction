/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Follow_artist$ref } from "./Follow_artist.graphql";
export type ArtistFollowQueryVariables = {
    readonly artistID: string;
};
export type ArtistFollowQueryResponse = {
    readonly artist: ({
        readonly " $fragmentRefs": Follow_artist$ref;
    }) | null;
};
export type ArtistFollowQuery = {
    readonly response: ArtistFollowQueryResponse;
    readonly variables: ArtistFollowQueryVariables;
};



/*
query ArtistFollowQuery(
  $artistID: String!
) {
  artist(id: $artistID) {
    ...Follow_artist
    __id
  }
}

fragment Follow_artist on Artist {
  __id
  id
  is_followed
  birthday
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artistID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ArtistFollowQuery",
  "id": null,
  "text": "query ArtistFollowQuery(\n  $artistID: String!\n) {\n  artist(id: $artistID) {\n    ...Follow_artist\n    __id\n  }\n}\n\nfragment Follow_artist on Artist {\n  __id\n  id\n  is_followed\n  birthday\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistFollowQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Follow_artist",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistFollowQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_followed",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "birthday",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'a310b3462684ecffc940c5b8fe99d0e9';
export default node;
