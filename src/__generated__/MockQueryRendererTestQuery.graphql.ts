/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MockQueryRenderer_related$ref } from "./MockQueryRenderer_related.graphql";
export type MockQueryRendererTestQueryVariables = {};
export type MockQueryRendererTestQueryResponse = {
    readonly artist: ({
        readonly name: string | null;
        readonly related: ({
            readonly " $fragmentRefs": MockQueryRenderer_related$ref;
        }) | null;
    }) | null;
};
export type MockQueryRendererTestQuery = {
    readonly response: MockQueryRendererTestQueryResponse;
    readonly variables: MockQueryRendererTestQueryVariables;
};



/*
query MockQueryRendererTestQuery {
  artist(id: "whatever") {
    name
    related {
      ...MockQueryRenderer_related
    }
    __id
  }
}

fragment MockQueryRenderer_related on ArtistRelatedData {
  artists {
    edges {
      node {
        banana: name
        __id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "whatever",
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
  "text": "query MockQueryRendererTestQuery {\n  artist(id: \"whatever\") {\n    name\n    related {\n      ...MockQueryRenderer_related\n    }\n    __id\n  }\n}\n\nfragment MockQueryRenderer_related on ArtistRelatedData {\n  artists {\n    edges {\n      node {\n        banana: name\n        __id\n      }\n    }\n  }\n}\n",
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
        "storageKey": "artist(id:\"whatever\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          v1,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "related",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistRelatedData",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "MockQueryRenderer_related",
                "args": null
              }
            ]
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
        "storageKey": "artist(id:\"whatever\")",
        "args": v0,
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          v1,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "related",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistRelatedData",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artists",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtistEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "banana",
                            "name": "name",
                            "args": null,
                            "storageKey": null
                          },
                          v2
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'a25d566afd6b20307f22e3446a292948';
export default node;
