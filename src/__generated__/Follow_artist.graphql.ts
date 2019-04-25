/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _Follow_artist$ref: unique symbol;
export type Follow_artist$ref = typeof _Follow_artist$ref;
export type Follow_artist = {
    readonly __id: string;
    readonly id: string;
    readonly is_followed: boolean | null;
    readonly birthday: string | null;
    readonly " $refType": Follow_artist$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Follow_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
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
};
(node as any).hash = '661739e302eb525caeb50457e8271a3c';
export default node;
