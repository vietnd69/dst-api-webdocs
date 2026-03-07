---
id: slingshotmods
title: Slingshotmods
description: Manages the containerized parts and modding interface for a slingshot, including part validation, skill requirements, and UI interaction.
tags: [inventory, crafting, ui, component]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ad1f692a
system_scope: inventory
---

# Slingshotmods

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Slingshotmods` is a server-authoritative component that manages a slingshot's attachable parts (band, frame, handle) via an internal container. It validates access (only the owner with the "walter_slingshot_modding" skill can open it), handles container creation, opening/closing, part transfer between slingshots, and persistence. It integrates with `container`, `containerinstallableitem`, `equippable`, `inventoryitem`, and `skilltreeupdater` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("slingshotmods")
-- Optional: listen for custom events
inst:ListenForEvent("ms_slingshotmodsclosed", function(inst, data)
    print("Slingshot UI closed by", data and data.doer or "system")
end)
```

## Dependencies & tags
**Components used:** `container`, `containerinstallableitem`, `equippable`, `inventoryitem`, `skilltreeupdater`  
**Tags:** Checks `inventoryitem`, `equippable`, `skilltreeupdater`; does not add or remove tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity instance this component is attached to. |
| `ismastersim` | boolean | inferred from `TheWorld.ismastersim` | Whether this instance is server-authoritative. |
| `isloading` | boolean? | `nil` | Set during loading to prevent premature validation. |
| `containerinst` | `Entity`? | `nil` | The persistent container entity holding slingshot parts. |
| `opener` | `Entity`? | `nil` | The entity that currently has the UI open. |

## Main functions
### `CanBeOpenedBy(doer)`
*   **Description:** Checks if the given entity is permitted to open this slingshot's modding interface. Requires the "walter_slingshot_modding" skill and that `doer` is the grand owner.
*   **Parameters:** `doer` (`Entity`) - the entity attempting to open the UI.
*   **Returns:** `boolean` — `true` if allowed, otherwise `false`.

### `IsLoading()`
*   **Description:** Reports whether the component is currently loading saved data. Only valid on the master simulation.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `isloading` is set, otherwise `false`. Returns `nil` on clients.

### `HasPartName(name)`
*   **Description:** Checks if the internal container holds at least one item with the given prefab name (e.g., `"slingshot_band"`, `"slingshot_frame"`).
*   **Parameters:** `name` (`string`) — the prefab name to search for.
*   **Returns:** `boolean?` — `true` if found, `false` otherwise. Returns `nil` if not on master or no container.

### `HasAnyParts()`
*   **Description:** Checks if the internal container holds any items.
*   **Parameters:** None.
*   **Returns:** `boolean?` — `true` if container exists and is not empty, otherwise `false` or `nil`.

### `GetPartBuildAndSymbol(slot)`
*   **Description:** Retrieves the prefab, build, and symbol of the part in a specific slingshot slot.
*   **Parameters:** `slot` (`"band"` \| `"frame"` \| `"handle"`) — named slot identifier.
*   **Returns:** `string?, string?, string?` — returns `prefab, swap_build, swap_symbol` if part exists, otherwise `nil`.

### `CheckRequiredSkillsForPlayer(player)`
*   **Description:** Verifies that the player satisfies the skill requirements for all installed parts. Parts may declare a `REQUIRED_SKILL` field.
*   **Parameters:** `player` (`Entity`) — the player entity to check.
*   **Returns:** `boolean` — `true` if all parts meet requirements (or no container/parts), `false` if any part is missing required skill.

### `Open(opener)`
*   **Description:** Opens the slingshot modding UI for the specified entity. Creates the internal container if needed.
*   **Parameters:** `opener` (`Entity`) — the entity opening the UI.
*   **Returns:** `boolean` — `true` on success, `false` if opening failed (e.g., not owner, container cannot open, not skill-qualified).

### `Close(opener)`
*   **Description:** Closes the modding UI. May be called with a specific opener to force-close for that entity only.
*   **Parameters:** `opener` (`Entity`?) — the opener to close; if `nil`, closes for current opener only.
*   **Returns:** `boolean` — `true` if closed successfully, `false` if UI wasn't open or opener mismatch.

### `OnUpdate(dt)`
*   **Description:** Callback used while the UI is open. Automatically closes the UI if the opener's state graph no longer has the `"moddingslingshot"` tag (e.g., user cancelled or switched actions).
*   **Parameters:** `dt` (`number`) — time since last update.
*   **Returns:** Nothing.

### `CreateContainer_Internal()`
*   **Description:** Instantiates and initializes the internal slingshot parts container prefab (`"slingshotmodscontainer"`). Must only be called on master simulation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TransferPartsTo(other)`
*   **Description:** Moves all installed parts from this slingshot to another slingshot (same component type). Preserves part installations without uninstalling.
*   **Parameters:** `other` (`SlingshotMods`) — the target slingshot's `Slingshotmods` component.
*   **Returns:** Nothing.

### `DropAllPartsWithoutUninstalling()`
*   **Description:** Drops all parts from the container as items, skipping uninstall logic (useful for disassembly or debugging).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes container contents for world save.
*   **Parameters:** None.
*   **Returns:** `table?, table?` — returns `{ parts = data }, refs` if container has parts; otherwise `nil`.

### `OnLoad(data, newents)`
*   **Description:** Restores container contents from saved data.
*   **Parameters:** `data` (`table`) — saved data containing `"parts"` key; `newents` (`table`) — new entity map for restore.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ondropped` — triggers automatic UI close via internal `doclose` handler.
- **Pushes:**  
  - `ms_slingshotmodsclosed` — fired on the opener when the UI is fully closed on master simulation.
