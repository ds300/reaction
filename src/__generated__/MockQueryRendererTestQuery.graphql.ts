/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Follow_artist$ref } from "./Follow_artist.graphql";
export type MockQueryRendererTestQueryVariables = {};
export type MockQueryRendererTestQueryResponse = {
    readonly artist: ({
        readonly name: string | null;
        readonly " $fragmentRefs": Follow_artist$ref;
    }) | null;
};
export type MockQueryRendererTestQuery = {
    readonly response: MockQueryRendererTestQueryResponse;
    readonly variables: MockQueryRendererTestQueryVariables;
};



/*
query MockQueryRendererTestQuery {
  artist(id: "blah") {
    name
    ...Follow_artist
    __id
  }
}

fragment Follow_artist on Artist {
  __id
  id
  is_followed
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "blah",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
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
  "name": "MockQueryRendererTestQuery",
  "id": null,
  "text": "query MockQueryRendererTestQuery {\n  artist(id: \"blah\") {\n    name\n    ...Follow_artist\n    __id\n  }\n}\n\nfragment Follow_artist on Artist {\n  __id\n  id\n  is_followed\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "MockQueryRendererTestQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"blah\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          v1,
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
    "name": "MockQueryRendererTestQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"blah\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          v1,
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
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '6dfa352cb78e5d3f3b71335266279f89';
export default node;
