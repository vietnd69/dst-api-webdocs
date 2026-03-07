---
id: lavae
title: Lavae
description: A temporary hostile minion spawned by the Volcano that chases and attacks targets selected by its mother entity, with a fixed lifespan and fire immunity.
tags: [combat, ai, boss, minion, fire]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4021ada1
system_scope: entity
---

# Lavae

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavae` is a temporary boss/minion entity that spawns during volcanic activity. It operates as a mobile combat unit with a predetermined lifespan, using a custom brain (`lavaebrain`) and state graph (`SGlavae`). It selects targets dynamically from its mother entity's target list, maintains range and attack timing, and automatically destroys itself when its lifespan expires. It is immune to fire damage and electric damage, and ignites flammable entities on physical contact.

## Usage example
```lua
local inst = SpawnPrefab("lavae")
if inst ~= nil then
    -- Lavae is fully self-contained; no further setup required
    -- It will track targets, fight, and self-destruct automatically
    print("Lavae spawned with health:", inst.components.health.currenthealth)
end
```

## Dependencies & tags
**Components used:** `health`, `combat`, `lootdropper`, `inspectable`, `locomotor`, `homeseeker`, `entitytracker`, `timer`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `light`, `physics`, `network`  
**Tags added:** `lavae`, `monster`, `hostile`, `electricdamageimmune`  
**Tags checked:** `fireimmune`, `controlled_burner`, `player`

## Properties
No public properties are exposed beyond standard component members.

## Main functions
### `OnCollide(inst, other)`
* **Description:** Called when this entity collides with another; ignites `burnable` entities that are not fueled (e.g., plants, trees).
* **Parameters:**  
  `inst` (Entity) – this lavae instance.  
  `other` (Entity) – the entity collided with.  
* **Returns:** Nothing.
* **Error states:** Only ignites if `other` is valid, has `burnable`, and lacks `fueled` component.

### `RetargetFn(inst)`
* **Description:** Function assigned to `Combat:SetRetargetFunction`; selects a new target from the mother entity’s group target list if no current target exists.
* **Parameters:**  
  `inst` (Entity) – this lavae instance.  
* **Returns:** `nil` or `Entity` – the closest entity to the mother in the target list.
* **Error states:** Sets `inst.reset = true` and triggers removal if the mother entity is missing.

### `KeepTargetFn(inst, target)`
* **Description:** Function assigned to `Combat:SetKeepTargetFunction`; determines if the current target should be retained based on proximity to the mother entity.
* **Parameters:**  
  `inst` (Entity) – this lavae instance.  
  `target` (Entity) – the current combat target.  
* **Returns:** `true` if the mother is within 75 units of the target; otherwise `false`.

### `LockTarget(inst, target)`
* **Description:** Utility function exposed on `inst` to programmatically set a new combat target.
* **Parameters:**  
  `inst` (Entity) – this lavae instance.  
  `target` (Entity) – the desired target.  
* **Returns:** Nothing.

### `OnNewTarget(inst, data)`
* **Description:** Listener for `newcombattarget`; manages death callback for player targets.
* **Parameters:**  
  `inst` (Entity) – this lavae instance.  
  `data` (table) – `{ oldtarget = Entity?, target = Entity? }`.  
* **Returns:** Nothing.
* **Error states:** Only registers death callback if `data.target` exists and has the `player` tag.

### `OnTimerDone(inst, data)`
* **Description:** Timer callback for `selfdestruct` timer; kills the lavae when lifespan expires.
* **Parameters:**  
  `inst` (Entity) – this lavae instance.  
  `data` (table) – `{ name = "selfdestruct" }`.  
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Listener for `entitysleep`; removes the entity if `inst.reset` is true (e.g., mother missing).
* **Parameters:**  
  `inst` (Entity) – this lavae instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `timerdone` – triggers `OnTimerDone` to kill self upon lifespan expiry.  
  `newcombattarget` – triggers `OnNewTarget` to update death callbacks.  
  `entitysleep` – triggers `OnEntitySleep` to clean up orphaned minions.  
- **Pushes:** None directly; relies on core components for event emission.
