---
id: fishable
title: Fishable
description: Manages a pool of fish that can be caught via fishing mechanics, including respawning, freezing states, and hooking/release logic.
tags: [fishing, entity, water, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 21b4ba3f
system_scope: world
---

# Fishable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fishable` is a component that tracks and manages a finite or renewable pool of fish available for fishing on an entity (typically a water tile or fishing spot). It supports fish spawning, hooking, releasing, respawning over time, and serialization. The component also integrates with the `weighable` component when fishing rods are used, setting the player who caught the fish as the owner of the hooked fish entity.

This component is typically added to static entities like water tiles (`pond`, `lava` in some contexts) and is activated/deactivated based on freezing conditions (`frozen` tag).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fishable")
inst.components.fishable:AddFish("butterflyfish")
inst.components.fishable:AddFish("slurtle")
inst.components.fishable:SetRespawnTime(120) -- 2 minutes
inst.components.fishable:RefreshFish()
```

## Dependencies & tags
**Components used:** `weighable` (via `fish.components.weighable:SetPlayerAsOwner`)
**Tags:** Adds/removes `fishable` tag; manages child entities (hooked fish).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component. |
| `fish` | `table` | `{}` | Map of available fish prefabs (`prefab` string → `prefab` string). |
| `maxfish` | `number` | `10` | Maximum number of fish in the pool at any time. |
| `fishleft` | `number` | `10` | Current number of fish available for catching. |
| `hookedfish` | `table` | `{}` | Map of currently hooked fish entities (`fish entity` → `fish entity`). |
| `fishrespawntime` | `number?` | `nil` | Delay (in seconds) before fish respawn after being caught. |
| `respawntask` | `Task?` | `nil` | Task handle for the next scheduled respawn. |
| `frozen` | `boolean` | `false` | Whether the water is currently frozen, preventing fishing. |

## Main functions
### `AddFish(prefab)`
*   **Description:** Registers a fish prefab type as catchable at this location.
*   **Parameters:** `prefab` (string) — the name of the prefab to add to the fish pool.
*   **Returns:** Nothing.

### `SetGetFishFn(fn)`
*   **Description:** Sets a custom function that determines which fish prefab is spawned when one is caught. Overrides random selection from `fish` pool.
*   **Parameters:** `fn` (function) — signature: `fn(fishing_spot: Entity, fisherman: Entity) → prefab: string`.
*   **Returns:** Nothing.

### `SetRespawnTime(time)`
*   **Description:** Sets the delay (in seconds) before caught fish respawn.
*   **Parameters:** `time` (number) — respawn delay in seconds.
*   **Returns:** Nothing.

### `HookFish(fisherman)`
*   **Description:** Spawns and hooks a fish to the fishing spot. The fish is hidden, non-physical, and persists until released or removed. If a custom `getfishfn` is set, it is used; otherwise a random key from `fish` is chosen.
*   **Parameters:** `fisherman` (`Entity?`) — the player catching the fish. Passed to `getfishfn` and used to set owner on the `weighable` component of the caught fish.
*   **Returns:** `Entity?` — the spawned fish entity, or `nil` if spawning failed.

### `ReleaseFish(fish)`
*   **Description:** Removes the fish from the hooked list and increments `fishleft` if under `maxfish`. Immediately destroys the fish entity.
*   **Parameters:** `fish` (`Entity`) — the fish entity to release.
*   **Returns:** Nothing.

### `RemoveFish(fish)`
*   **Description:** Removes the fish from the hooked list and schedules respawning (if `fishrespawntime` is set). Does *not* destroy the fish — intended for cases where the fishing rod restores the fish entity later.
*   **Parameters:** `fish` (`Entity`) — the fish entity to remove.
*   **Returns:** `Entity?` — the same `fish` entity, if it was in `hookedfish`, otherwise `nil`.

### `IsFrozenOver()`
*   **Description:** Checks whether the water is currently frozen.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if frozen, `false` otherwise.

### `Freeze()`
*   **Description:** Marks the fishable area as frozen, preventing further fishing. Removes the `fishable` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Unfreeze()`
*   **Description:** Unfreezes the water and restores the `fishable` tag, enabling fishing again.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshFish()`
*   **Description:** Schedules a respawn task to increment `fishleft` after `fishrespawntime` seconds (if set). Recursively refreshes if still under `maxfish`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetFishPercent()`
*   **Description:** Returns the ratio of remaining fish to the maximum pool size.
*   **Parameters:** None.
*   **Returns:** `number` — value in the range `[0, 1]`.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string showing remaining fish.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"fishleft: 7"`.

## Events & listeners
- **Listens to:** `frozen` — handled by the module-level `onfrozen` callback: removes/adds `fishable` tag based on `frozen` state.
- **Pushes:** None.

### Component lifecycle hooks
- **OnRemoveFromEntity():** Removes the `fishable` tag from the entity when the component is removed.
- **OnSave():** Returns `{fish = self.fishleft}` if fish have been caught (`fishleft < maxfish`). Used for save/restore.
- **OnLoad(data):** Restores `fishleft` from saved data and schedules a respawn refresh.
