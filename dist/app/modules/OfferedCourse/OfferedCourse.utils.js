"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTimeConflict = void 0;
const hasTimeConflict = (assignedSchedules, newSchedule) => {
    for (const schedule of assignedSchedules) {
        const existingStartTime = new Date(`1990-01-01T${schedule.startTime}`);
        const existingEndTime = new Date(`1990-01-01T${schedule.endTime}`);
        const newStartTime = new Date(`1990-01-01T${newSchedule.startTime}`);
        const newEndTime = new Date(`1990-01-01T${newSchedule.endTime}`);
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            return true;
        }
    }
    return false;
};
exports.hasTimeConflict = hasTimeConflict;
