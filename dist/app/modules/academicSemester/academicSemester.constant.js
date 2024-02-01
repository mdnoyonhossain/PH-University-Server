"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterSearchableFields = exports.academicSemesterNameCodeMapper = exports.AcademicSemesterCode = exports.AcademicSemesterName = exports.Months = void 0;
exports.Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
exports.AcademicSemesterName = [
    'Autumn',
    'Summer',
    'Fall',
];
exports.AcademicSemesterCode = ['01', '02', '03'];
exports.academicSemesterNameCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
};
exports.AcademicSemesterSearchableFields = ['name', 'year'];
