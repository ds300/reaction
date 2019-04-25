/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _MockQueryRenderer_related$ref: unique symbol;
export type MockQueryRenderer_related$ref = typeof _MockQueryRenderer_related$ref;
export type MockQueryRenderer_related = {
    readonly artists: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly banana: string | null;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": MockQueryRenderer_related$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "MockQueryRenderer_related",
  "type": "ArtistRelatedData",
  "metadata": null,
  "argumentDefinitions": [],
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
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__id",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '773bb1f7f79425f79202c19007bc6e1d';
export default node;
