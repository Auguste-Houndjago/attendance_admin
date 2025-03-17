'use client'

import React, { useEffect, useState } from 'react';
import CourseGrid from './CourseGrid';





const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
             
                const response = await fetch('/api/courses'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                
                setCourses(data);
                
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError('Error fetching courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <p>...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='flex'>
   
           


            <div className="p-4 border-2 rounded-md">
               
                <CourseGrid courses={courses} />
            </div>
            <ul>



            </ul>
        </div>
    );
};

export default CourseList;


