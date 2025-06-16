---
id: project-management
title: Integrating with Project Management Tools
sidebar_position: 19
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Integrating with Project Management Tools

Effective project management can significantly improve your Don't Starve Together modding workflow, especially for complex mods or collaborative projects. This guide covers how to integrate various project management tools with your DST modding process.

## Why Use Project Management for DST Mods?

- **Organization**: Track features, bugs, and tasks in one place
- **Planning**: Create roadmaps and milestones for your mod
- **Collaboration**: Coordinate work between multiple contributors
- **Documentation**: Keep design decisions and requirements organized
- **User Feedback**: Manage feature requests and bug reports from users

## GitHub-based Project Management

### GitHub Issues

GitHub Issues provides a lightweight project management system directly integrated with your code repository:

1. **Setting Up Issue Templates**:
   Create `.github/ISSUE_TEMPLATE/` directory with templates for common issues:

   ```markdown
   <!-- bug_report.md -->
   ---
   name: Bug report
   about: Create a report to help improve the mod
   ---

   ## Description
   A clear description of the bug

   ## Steps to Reproduce
   1. Go to '...'
   2. Click on '....'
   3. See error

   ## Expected Behavior
   What you expected to happen

   ## Screenshots
   If applicable, add screenshots

   ## Environment
   - DST Version: [e.g., 486968]
   - Mod Version: [e.g., 1.2.0]
   - Other mods installed: [list any other mods]
   ```

2. **Issue Labels**:
   Create a consistent labeling system:
   - `bug`: Something isn't working
   - `enhancement`: New feature or request
   - `documentation`: Documentation improvements
   - `good first issue`: Good for newcomers
   - `help wanted`: Extra attention needed

3. **Milestones**:
   Group issues into milestones for planned releases:
   - Navigate to Issues → Milestones → New Milestone
   - Name it (e.g., "Version 1.2.0")
   - Add a description and due date
   - Assign relevant issues to the milestone

### GitHub Projects

GitHub Projects provides Kanban-style boards for tracking work:

1. **Setting Up a Project Board**:
   - Go to your repository → Projects → New Project
   - Choose a template (Basic Kanban is recommended)
   - Create columns: To Do, In Progress, Review, Done

2. **Automating Workflow**:
   - Set up automation rules:
     - New issues added to "To Do"
     - Newly assigned issues moved to "In Progress"
     - Closed issues moved to "Done"

3. **Planning Releases**:
   - Create a project board for each major release
   - Add cards for features, bugs, and tasks
   - Track progress visually as cards move across the board

## External Project Management Tools

### Trello for DST Modding

Trello is a flexible, visual tool that works well for mod development:

1. **Basic Trello Setup**:
   - Create a new board for your mod
   - Add standard lists: Backlog, To Do, In Progress, Testing, Done
   - Create cards for features, bugs, and tasks

2. **Custom Lists for Mod Development**:
   - **Ideas**: Capture initial concepts
   - **Research**: Items requiring investigation
   - **Art Assets**: Track needed graphics/animations
   - **Code**: Programming tasks
   - **Testing**: Items being tested
   - **Workshop**: Ready for Steam Workshop

3. **Power-Ups for GitHub Integration**:
   - Add the GitHub Power-Up to link cards to commits and issues
   - Attach code snippets and documentation to cards
   - Use due dates for release planning

4. **Trello Labels for Mod Components**:
   - UI/Interface
   - Prefabs
   - Components
   - Animations
   - Networking
   - Performance

### Notion for Comprehensive Mod Management

Notion provides a more comprehensive workspace for complex mods:

1. **Setting Up a Notion Workspace**:
   - Create a workspace for your mod
   - Set up key pages:
     - Roadmap
     - Feature Database
     - Bug Tracker
     - Documentation
     - Resources

2. **Feature Database**:
   Create a database with these properties:
   - Status (Idea, Planned, In Progress, Testing, Complete)
   - Priority (Low, Medium, High, Critical)
   - Complexity (Easy, Medium, Hard)
   - Assigned To
   - Related Components
   - Dependencies

3. **Documentation Integration**:
   - Create linked documentation for complex features
   - Embed code snippets and examples
   - Create design documents with diagrams
   - Link to external resources and references

4. **Notion Templates for Common Tasks**:
   - Feature Specification Template
   - Bug Report Template
   - Release Checklist Template
   - Testing Protocol Template

## Integrating with Discord

Discord can serve as a communication hub for your mod:

1. **Setting Up a Mod Discord**:
   - Create a server for your mod
   - Set up key channels:
     - #announcements
     - #general
     - #bug-reports
     - #feature-requests
     - #development
     - #resources

2. **GitHub Integration**:
   - Add a webhook to post repository events to Discord
   - Connect GitHub issues to a dedicated channel
   - Post automatic updates when new versions are released

3. **User Feedback Management**:
   - Create a bot to collect structured feedback
   - Use reaction roles to organize testers
   - Set up forms for bug reports that integrate with your project management system

## Workflow Integration Examples

### Small Solo Mod Workflow

For individual modders with smaller projects:

1. Use GitHub Issues to track bugs and features
2. Create milestones for version planning
3. Use a simple README.md roadmap
4. Organize work with commit messages that reference issues

Example commit message:
```
Add custom crafting tab for magical items

- Creates new crafting tab with custom icon
- Adds tab to survival machine
- Implements proper controller navigation

Closes #12
```

### Medium Team Mod Workflow

For small teams (2-5 people):

1. Set up GitHub Projects with automation
2. Use branch protection rules to enforce code review
3. Implement a pull request template
4. Hold weekly check-ins via Discord
5. Use GitHub Actions for CI/CD (see [CI/CD Workflow](cicd-workflow.md))

### Large Mod Project Workflow

For complex mods with multiple contributors:

1. Use Notion or Jira for comprehensive project management
2. Implement formal code review process
3. Create detailed documentation for all systems
4. Use feature flags for work-in-progress features
5. Implement automated testing
6. Schedule regular team meetings and planning sessions

## Best Practices for DST Mod Project Management

1. **Start Simple**: Begin with basic tools and add complexity as needed
2. **Be Consistent**: Use the same workflow and terminology throughout
3. **Document Decisions**: Record why design choices were made
4. **Plan Releases**: Group related features into coherent releases
5. **Manage Scope**: Be realistic about what can be accomplished
6. **Get User Feedback Early**: Involve users in the development process
7. **Automate When Possible**: Use CI/CD and other automation tools

## Project Management Templates

### Basic Mod Roadmap Template

```markdown
# My DST Mod Roadmap

## Current Version: 1.0.0

## Next Release: 1.1.0 (Target: June 2023)
- [ ] Add new craftable item: Magic Staff
- [ ] Implement custom crafting tab
- [ ] Add special effects for staff usage
- [ ] Balance staff crafting recipe

## Future Plans: 1.2.0
- [ ] Add staff upgrades system
- [ ] Create custom character with staff bonuses
- [ ] Implement staff-specific animations

## Backlog
- Custom sounds for staff
- Integration with other magic mods
- Staff skins system
```

### Feature Specification Template

```markdown
# Feature: Magic Staff

## Overview
A craftable staff that allows players to cast light and deal damage.

## Requirements
- Must be craftable at Alchemy Engine
- Should have limited uses (20 by default)
- Primary action: Cast light in a radius of 8 units for 30 seconds
- Secondary action: Deal 20 damage to target with 3-second cooldown

## Technical Implementation
- Create new prefab: `magic_staff`
- Add components:
  - `finiteuses` for durability
  - `weapon` for attack functionality
  - `lightsource` for illumination
- Create custom stategraph for casting animations

## Art Requirements
- Staff model and textures
- Cast light animation
- Attack animation
- Inventory icon

## Testing Criteria
- Staff crafting recipe works correctly
- Light casting works as expected
- Attack damage is applied correctly
- Durability decreases appropriately
- Animations play smoothly
```

## See also

- [Git Integration](git-integration.md) - For version control setup
- [CI/CD Workflow](cicd-workflow.md) - For automated testing and deployment
- [Useful Extensions and Tools](useful-extensions.md) - For additional development tools
- [Testing Environment](testing-environment.md) - For setting up a testing environment 
