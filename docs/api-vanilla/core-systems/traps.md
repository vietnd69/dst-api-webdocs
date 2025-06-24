---
id: traps
title: Traps
description: Legacy redirection file pointing to trap functionality now located in scenarios folder
sidebar_position: 170
slug: api-vanilla/core-systems/traps
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Traps

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `traps.lua` file serves as a legacy redirection file that indicates trap functionality has been relocated to the scenarios system. This file contains only a comment directing developers to the scenarios folder where trap-related content is now maintained.

## File Contents

```lua
--These are all in the "scenarios" folder now!
```

## Migration Information

### Historical Context

Previously, trap definitions and configurations were maintained in the `traps.lua` file as part of the core systems. The functionality has been reorganized and moved to a more appropriate location within the scenarios system for better organization and modularity.

### Current Location

Trap-related functionality can now be found in:

**Primary Location:** `scripts/scenarios/`

**Available Trap Scenarios:**
- Chest scenarios with trap mechanisms
- Environmental trap configurations  
- Interactive trap behaviors
- Trap-related world generation logic

## Scenarios Integration

### Accessing Trap Functionality

Instead of referencing `traps.lua`, developers should now look to the scenarios system:

```lua
-- Legacy approach (deprecated)
-- require "traps"

-- Current approach
-- Trap functionality is now integrated into specific scenario files
-- Example: scripts/scenarios/chest_abandonedboat.lua contains trapped chest logic
```

### Scenario-Based Trap Examples

The scenarios folder contains various trap implementations:

```lua
-- Example of trap functionality in scenarios
-- Located in scripts/scenarios/[specific_scenario].lua
local function SetupTrappedChest(inst)
    -- Trap logic now embedded in scenario-specific context
    inst:AddComponent("trap")
    inst.components.trap:SetSpringRadius(2)
    -- ... additional trap configuration
end
```

## Migration Guide

### For Developers

If you were previously referencing or modifying `traps.lua`:

1. **Identify the specific trap functionality** you need
2. **Search the scenarios folder** for relevant trap implementations
3. **Reference scenario-specific files** instead of the legacy traps module
4. **Follow scenario conventions** for implementing new trap behaviors

### For Modders

When creating mods that involve traps:

```lua
-- Instead of modifying traps.lua, create scenario-based implementations
local function AddCustomTrap()
    -- Use scenario system for trap logic
    local scenario_data = {
        trap_type = "custom_trap",
        trigger_radius = 3,
        effects = {"damage", "stun"}
    }
    
    return scenario_data
end
```

## Finding Trap Content

### Scenarios Directory Structure

```
scripts/scenarios/
├── chest_abandonedboat.lua    -- Trapped chest scenarios
├── camera_maxwellthrone.lua   -- Camera-based trap triggers  
├── [scenario_name].lua        -- Other scenario files with trap logic
└── ...
```

### Search Strategy

To locate specific trap functionality:

1. **Browse scenarios folder** for files containing trap-related names
2. **Search for "trap" keyword** within scenario files
3. **Check scenario documentation** for trap-specific behaviors
4. **Reference scenario index** for organized trap listings

## Related Modules

- [Scenarios](../scenarios/index.md): Main scenarios system documentation
- [Components](../components/index.md): Trap component implementations
- [World Generation](../map/index.md): Trap placement in world generation

## Development Notes

### Why the Migration Occurred

The relocation of trap functionality to scenarios provides:

- **Better Organization**: Traps are now contextualized within their usage scenarios
- **Improved Modularity**: Scenario-specific trap behavior is isolated and maintainable
- **Enhanced Flexibility**: Traps can be customized per scenario without affecting global systems
- **Clearer Dependencies**: Trap logic is coupled with the scenarios that use them

### Best Practices

When working with trap functionality:

1. **Use scenario-based approach** for implementing new traps
2. **Reference existing scenarios** for established trap patterns
3. **Maintain scenario conventions** for consistency
4. **Document trap behaviors** within their specific scenario contexts

## Source Reference

**File Location:** `scripts/traps.lua`

**Content Type:** Legacy redirection comment

**Current Implementation:** See `scripts/scenarios/` directory

**Global Access:** No longer provides global trap functionality - use scenario-specific implementations instead
