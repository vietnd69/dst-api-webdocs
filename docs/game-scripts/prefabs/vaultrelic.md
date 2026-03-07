---
id: vaultrelic
title: Vaultrelic
description: A collectible decorative item that can be placed on furniture, decorated with flowers, and repaired; it provides ambient light and sanity benefits when freshly decorated.
tags: [decoration, light, sanity, loot, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a0929239
system_scope: world
---

# Vaultrelic

> Based on game build **714000** | Last updated: 2026-03-07

## Overview
The `vaultrelic` prefab implements a family of decorative vault statues (bowl, vase, and planter) that serve as collectible and interactive decorative objects. When undecorated, it functions as a workable item that can be repaired with a hammer. Once placed on furniture via the `furnituredecor` component, it becomes non-workable and can be decorated with flowers using the `vase` component. Decorated relics emit soft light and provide sanity bonuses when first decorated. The relic persists across world loads by linking to its parent `VaultPillar` entity.

Key behaviors include:
- Variational state management (broken/moss/no-moss variants)
- Flower decoration and light emission via `vase` component hooks
- Integration with furniture decor placement and loot generation
- Persistence logic via save/load callbacks that reference pillar entities

## Usage example
```lua
-- Create and decorate a vault relic
local relic = SpawnPrefab("vaultrelic_vase")
relic.Transform:SetPosition(player.Transform:GetWorldPosition())
relic.components.vase:SetFlower(2, true)  -- Flower type 2, fresh
relic.components.furnituredecor:DecorateOn(player, "table")
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `furnituredecor`, `vase`, `workable`, `lootdropper`, `light`, `physics`, `follower`, `soundemitter`, `network`, `transform`, `animstate`, `hauntable`.

**Tags:** Adds `vase`, `furnituredecor` in pristine state; checks `HAMMER_workable` for display name.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | `1` | Current statue variant (1-3 = intact, 4-6 = broken); controls moss and broken state. |
| `broken` | net_bool | `false` | Networked boolean indicating if the relic is broken. |
| `anim` | string | `"idle_vase1"` | Base animation bank name for animation playback. |
| `pillar` | Entity | `nil` | Reference to the `VaultPillar` entity this relic is attached to (post-load). |
| `displaynamefn` | function | `DisplayNameFn` | Callback used to determine the display name under inspection. |

## Main functions
### `SetVariation(variation)`
*   **Description:** Updates the visual state of the relic (e.g., moss accumulation, broken state) and synchronizes animation/symbol visibility.
*   **Parameters:** `variation` (number) – Variant ID (1–6). Values ≤3 represent intact statues; >3 represent broken variants. Values 2 & 5 have moss1, 3 & 6 have moss2.
*   **Returns:** Nothing.
*   **Error states:** No-op if the new variation matches the current value.

### `AttachToVaultPillar(pillar)`
*   **Description:** Attaches the relic to a `VaultPillar` entity, removing components that are no longer needed for server-side replicas and setting physics and visual attachment.
*   **Parameters:** `pillar` (Entity) – The `VaultPillar` instance to attach to.
*   **Returns:** Nothing.

### `ConvertToCrafted(inst)`
*   **Description:** Resets the relic to pristine state (variation = 1, removes `variation` field), typically called upon building via `OnBuiltFn`.
*   **Parameters:** `inst` (Entity) – The relic instance (implicit when called as `inst:SetVariation(1); inst.variation = nil`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ondeconstructstructure` – Triggers `OnDeconstruct` to drop `spoiled_food` if a flower is present.
- **Pushes:** `vaultrelic.variation` (via `net_bool`) – Networked update of broken state; no explicit `PushEvent` calls in source.
