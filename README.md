# 📝 Nested Todo List

A modern, interactive todo list application that supports nested subtasks for better task organization.

## Features

### ✨ Core Functionality
- **Add Todo Items**: Create main todo items with a simple input interface
- **Nested Subtasks**: Add unlimited levels of subtasks to any todo item
- **Mark Complete**: Check off completed tasks and subtasks
- **Delete Items**: Remove todo items and their subtasks
- **Persistent Storage**: All data is saved to browser localStorage

### 🎯 Nested Todo Features
- **Hierarchical Structure**: Organize tasks with parent-child relationships
- **Visual Nesting**: Clear visual indication of task hierarchy with indentation
- **Cascade Completion**: When a parent task is marked complete, all subtasks are automatically completed
- **Independent Subtasks**: Subtasks can be managed independently of their parent
- **Multi-level Nesting**: Support for deeply nested task structures

### 📊 Statistics
- Real-time count of total tasks (including subtasks)
- Track completed vs. remaining tasks
- Visual progress indication

## How to Use

1. **Add a Main Todo**: Type in the input field and click "Add Todo" or press Enter
2. **Add Subtasks**: Click "Add Subtask" on any todo item to create nested tasks
3. **Complete Tasks**: Check the checkbox to mark items as complete
4. **Delete Tasks**: Use the delete button to remove tasks and all their subtasks
5. **Organize**: Create multiple levels of nesting to organize complex projects

## Example Structure

```
📋 Plan vacation trip
  ✅ Research destinations
  ❌ Book flights
  ❌ Find accommodation
    ❌ Check hotel reviews
    ❌ Compare prices

📋 Complete project presentation
  ✅ Create slides
  ❌ Practice presentation
```

## Technical Details

- **Pure JavaScript**: No external dependencies
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Data persists between browser sessions
- **Modern CSS**: Clean, gradient-based design with smooth animations

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - JavaScript functionality for nested todos
- `README.md` - Documentation

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Classes
- LocalStorage API
- CSS Grid/Flexbox

## Getting Started

Simply open `index.html` in your web browser to start using the nested todo list!

