---
id: bundlemaker
title: Bundlemaker
description: Manages the data and callbacks for an entity that can create bundled items.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: crafting
source_hash: cf22819f
---

# Bundlemaker

## Overview
The Bundlemaker component holds configuration data for entities capable of bundling items. It defines the prefabs used for the in-progress bundling animation and the final bundled item, and allows for custom logic to be executed when the bundling action begins. It can also carry over skin data to the resulting bundled item.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `bundlingprefab` | string | `nil` | The asset prefab name for the entity that appears while bundling is in progress. |
| `bundledprefab` | string | `nil` | The asset prefab name for the final item created after bundling is complete. |
| `onstartbundlingfn` | function | `nil` | A callback function that is executed when bundling starts. |
| `bundledskinname` | string | `nil` | The skin name to be applied to the final bundled item. |
| `bundledskin_id` | number | `nil` | The numerical skin ID to be applied to the final bundled item. |

## Main Functions
### `SetBundlingPrefabs(bundling, bundled)`
* **Description:** Sets the prefabs to be used for the bundling process and the resulting item.
* **Parameters:**
    * `bundling` (string): The prefab name for the in-progress bundling object.
    * `bundled` (string): The prefab name for the completed bundled item.

### `SetSkinData(skinname, skin_id)`
* **Description:** Assigns skin information to be applied to the final bundled item.
* **Parameters:**
    * `skinname` (string): The name of the skin.
    * `skin_id` (number): The numerical ID of the skin.

### `SetOnStartBundlingFn(fn)`
* **Description:** Sets a callback function to be executed when the `OnStartBundling` function is called.
* **Parameters:**
    * `fn` (function): The function to be called. It will receive the component's entity instance (`inst`) and the `doer` as arguments.

### `OnStartBundling(doer)`
* **Description:** Triggers the bundling process by executing the `onstartbundlingfn` callback if it has been set.
* **Parameters:**
    * `doer` (Entity): The entity that initiated the bundling action.