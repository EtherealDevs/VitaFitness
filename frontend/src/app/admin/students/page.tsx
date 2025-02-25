'use client';
import { useStudents } from '@/hooks/students'
import { useAuth } from '@/hooks/auth'

export default function StudentsPage()
{
    const { getStudents } = useStudents();
    console.log(getStudents());


    return (
        <div>
            <h1>Students Page</h1>
            <p>This is the Students page.</p>
            <p>Here you can view and manage student information.</p>
            <p>Add, edit, and delete students using the provided forms.</p>
            <p>Click on a student's name to view their details.</p>
            {/* Students table */}
            {/* Add, edit, and delete buttons */}
            {/* Pagination */}
            {/* Search bar */}
            {/* Sorting options */}
            {/* Filter options */}
            {/* Add student form */}
            {/* Edit student form */}
            {/* Delete student confirmation modal */}
            {/* Student details page */}
            {/* Back to students list button */}
            {/* Previous, Next buttons */}
            {/* Edit, Delete buttons */}
        </div>
    )
}