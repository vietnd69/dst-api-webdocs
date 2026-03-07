---
id: bundlemaker
title: Bundlemaker
description: Stores configuration for bundling items, including the source and target prefabs, optional skin data, and a callback for when bundling begins.
tags: [crafting, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cf22819f
system_scope: inventory
---

# Bundlemaker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BundleMaker` is a utility component that holds metadata required for item bundling operations. It does not perform bundling itself but provides the necessary configuration (prefab names, optional skin data, and startup callback) to external systems (such as crafting or inventory logic) that execute the bundling process. This component is typically attached to crafting-related prefabs or containers where bundling is a supported action.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bundlemaker")
inst.components.bundlemaker:SetBundlingPrefabs("bundle", "stick")
inst.components.bundlemaker:SetSkinData("summer_stick", 12345)
inst.components.bundlemaker:SetOnStartBundlingFn(function(inst, doer)
    print("Starting bundling for", inst.prefab)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bundlingprefab` | string or nil | `nil` | The prefab name of the bundling tool (e.g., `"bundle"`). |
| `bundledprefab` | string or nil | `nil` | The prefab name of the item being bundled (e.g., `"stick"`). |
| `bundledskinname` | string or nil | `nil` | Optional skin name for the bundled item. |
| `bundledskin_id` | number or nil | `nil` | Optional numeric ID for the bundled item's skin. |
| `onstartbundlingfn` | function or nil | `nil` | Optional callback invoked when bundling begins; signature `fn(inst, doer)`. |

## Main functions
### `SetBundlingPrefabs(bundling, bundled)`
* **Description:** Sets the prefab names for the bundling tool and the item being bundled.
* **Parameters:**  
  - `bundling` (string) — prefab name of the bundling item/tool.  
  - `bundled` (string) — prefab name of the item that will be created/bundled.
* **Returns:** Nothing.

### `SetSkinData(skinname, skin_id)`
* **Description:** Sets optional skin information for the bundled item, used when skin variants exist.
* **Parameters:**  
  - `skinname` (string) — skin identifier name.  
  - `skin_id` (number) — unique numeric skin ID.
* **Returns:** Nothing.

### `SetOnStartBundlingFn(fn)`
* **Description:** Assigns a callback function to be executed when bundling is initiated.
* **Parameters:**  
  - `fn` (function) — a function that accepts two arguments: `inst` (the bundlemaker owner) and `doer` (the entity performing bundling).
* **Returns:** Nothing.

### `OnStartBundling(doer)`
* **Description:** Invokes the stored callback (if present) to signal bundling has started.
* **Parameters:**  
  - `doer` (entity) — the entity that triggered the bundling action.
* **Returns:** Nothing.

## Events & listeners
None identified
