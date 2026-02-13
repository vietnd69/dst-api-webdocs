```lua
local Bosstargeter = Class(function(self, inst)
    self.inst = inst
    self.target = nil
    self.targetdist = 0

    self.targetfn = function(guy)
        return guy.components.combat and guy.components.health and not guy.components.health:IsDead()
    end
    self.searchrange = 30
    self.searchtask = nil
    self.onfoundtarget = nil
    self.onlosttarget = nil

end)

function Bosstargeter:SetTargetFn(fn)
    self.targetfn = fn
end

function Bosstargeter:SetSearchRange(range)
    self.searchrange = range
end

function Bosstargeter:OnFoundTarget(fn)
    self.onfoundtarget = fn
end

function Bosstargeter:OnLostTarget(fn)
    self.onlosttarget = fn
end

function Bosstargeter:StartSearching(delay)
    self.searchtask = self.inst:DoTaskInTime(delay or 0, function() self:FindTarget() end)
    self.inst:StartUpdatingComponent(self)
end

function Bosstargeter:StopSearching()
    if self.searchtask then
        self.searchtask:Cancel()
        self.searchtask = nil
    end

    self.inst:StopUpdatingComponent(self)
end

function Bosstargeter:FindTarget()
    if self.target == nil then
        local target = FindClosestPlayerToInst(self.inst, self.searchrange, self.targetfn)

        if target then
            self.target = target
            if self.onfoundtarget then
                self.onfoundtarget(self.inst, self.target)
            end
        end
    end

    self.searchtask = self.inst:DoTaskInTime(1, function() self:FindTarget() end)
end

function Bosstargeter:OnUpdate(dt)
    if self.target then
        if self.target:IsValid() and self.targetfn(self.target) and self.inst:GetDistanceSqToInst(self.target) < self.searchrange*self.searchrange then
            self.targetdist = self.inst:GetDistanceSqToInst(self.target)
        else
            if self.onlosttarget then
                self.onlosttarget(self.inst, self.target)
            end
            self.target = nil
        end
    end
end

function Bosstargeter:GetTarget()
    return self.target
end

function Bosstargeter:OnRemoveFromEntity()
    self:StopSearching()
end

return Bosstargeter
```

---
id: bosstargeter
title: Bosstargeter
description: Manages target acquisition and tracking for boss-type entities, periodically searching for the closest valid player.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
---

# Bosstargeter

## Overview
The `Bosstargeter` component provides entities, typically bosses, with the ability to automatically find and track player targets. It periodically scans within a configurable range for the closest valid player, managing the entire lifecycle of acquiring, validating, and losing a target.

## Dependencies & Tags
This component's default target validation function (`targetfn`) requires that potential targets have the following components:
*   `health`
*   `combat`

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `target` | `Entity` | `nil` | The current entity being targeted. |
| `targetdist` | `number` | `0` | The squared distance to the current target. Updated in `OnUpdate`. |
| `targetfn` | `function` | function | A function used to validate if an entity is a suitable target. By default, checks if the entity has `combat` and non-dead `health` components. |
| `searchrange` | `number` | `30` | The maximum radius to search for new targets. |
| `onfoundtarget` | `function` | `nil` | A callback function that triggers when a new target is acquired. It receives the component's owner instance and the new target as arguments. |
| `onlosttarget` | `function` | `nil` | A callback function that triggers when the current target is lost. It receives the component's owner instance and the lost target as arguments. |
| `searchtask` | `Task` | `nil` | A handle for the periodic task that searches for new targets. |

## Main Functions

### `SetTargetFn(fn)`
* **Description:** Overrides the default function used to validate potential targets. This allows for custom targeting logic beyond the default health and combat checks.
* **Parameters:**
    * `fn` (`function`): A function that accepts an entity as an argument and returns `true` if it is a valid target, `false` otherwise.

### `SetSearchRange(range)`
* **Description:** Sets the maximum distance within which the component will search for targets.
* **Parameters:**
    * `range` (`number`): The new search radius.

### `OnFoundTarget(fn)`
* **Description:** Assigns a callback function to be executed when a new target is successfully found and acquired.
* **Parameters:**
    * `fn` (`function`): The callback function. It will be called with two arguments: the component's entity instance (`inst`) and the newly found target (`target`).

### `OnLostTarget(fn)`
* **Description:** Assigns a callback function to be executed when the current target is lost (e.g., goes out of range, dies, or becomes invalid).
* **Parameters:**
    * `fn` (`function`): The callback function. It will be called with two arguments: the component's entity instance (`inst`) and the target that was just lost.

### `StartSearching(delay)`
* **Description:** Begins the periodic search for a target and starts the `OnUpdate` loop for continuous target validation. The search will repeat every 1 second after the initial delay.
* **Parameters:**
    * `delay` (`number`, optional): The initial delay in seconds before the first search is performed. Defaults to `0`.

### `StopSearching()`
* **Description:** Halts the periodic target search and stops the `OnUpdate` loop.
* **Parameters:** None.

### `FindTarget()`
* **Description:** Performs a one-time search for the closest valid player within the `searchrange`. If a target is found, it is assigned, and the `onfoundtarget` callback is triggered. This function is typically called automatically by the `searchtask` initiated by `StartSearching()`.
* **Parameters:** None.

### `GetTarget()`
* **Description:** Returns the currently acquired target entity.
* **Parameters:** None.