import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
    try {
        const { status, priority, sortBy } = req.query;

        let query = { user: req.user._id };

        if (status && status !== 'All') {
            query.status = status;
        }

        if (priority && priority !== 'All') {
            query.priority = priority;
        }

        let sortOptions = {};
        if (sortBy === 'dueDate') {
            sortOptions.dueDate = 1;
        } else if (sortBy === 'priority') {
            sortOptions.priority = -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const tasks = await Task.find(query).sort(sortOptions);

        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error fetching tasks' });
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this task' });
        }

        res.json(task);
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ message: 'Server error fetching task' });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate, reminderDate } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const task = await Task.create({
            title,
            description,
            priority: priority || 'Medium',
            status: status || 'Pending',
            dueDate: dueDate || null,
            reminderDate: reminderDate || null,
            user: req.user._id
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error creating task' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const { title, description, priority, status, dueDate, reminderDate } = req.body;

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
        task.reminderDate = reminderDate !== undefined ? reminderDate : task.reminderDate;

        const updatedTask = await task.save();

        res.json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error updating task' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error deleting task' });
    }
};
