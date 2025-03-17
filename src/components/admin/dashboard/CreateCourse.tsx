'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@heroui/react';
import { Alert } from '@/components/ui/alert';
import LoadButton from '@/components/ux/LoadButton';

interface Course {
  id: string;
  name: string;
  startDate: string;
  abbreviation: string;
}

const CreateCourse: React.FC = () => {
    const [courseName, setCourseName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [existingCourses, setExistingCourses] = useState<Course[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);

    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const fetchCourses = async (searchTerm: string) => {
        if (!searchTerm) return;
        
        setLoadingSuggestions(true);
        try {
            const response = await fetch(`/api/courses/search?name=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) throw new Error('Failed to fetch courses');
            
            const data = await response.json();
            setExistingCourses(data);
            
            const hasDuplicate = data.some((course: Course) => 
                course.name.toLowerCase() === searchTerm.toLowerCase()
            );
            setIsDuplicate(hasDuplicate);
            
            if (hasDuplicate) {
                setError('A course with this name already exists');
            } else {
                setError(null);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError('Error checking course names');
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const debouncedFetchCourses = debounce(fetchCourses, 300);

    const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setCourseName(newName);
        debouncedFetchCourses(newName);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isDuplicate) {
            setError('Cannot create duplicate course');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseName, startDate, abbreviation }),
            });

            if (!response.ok) {
                throw new Error('Failed to create course');
            }

            router.push('/admin');
        } catch (error) {
            console.error("Error creating course:", error);
            setError('Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto border-black  dark:border-white dark:bg-[#252530] bg-background border-2   rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center gap-2 mb-6">
                <div className="flex size-14 items-center justify-center rounded-full border">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-center">Créer un cours</h1>
                <p className="text-sm text-center">Remplissez le formulaire pour créer un nouveau cours</p>
            </div>
            
            {error && (
                <Alert variant="destructive" className="mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Nom du cours:</label>
                    <Input
                        type="text"
                        value={courseName}
                        onChange={handleCourseNameChange}
                        className={isDuplicate ? 'border-red-500' : ''}
                        placeholder="Entrez le nom du cours"
                        required
                    />
                    
                    {loadingSuggestions && (
                        <p className="text-sm">Recherche de cours similaires...</p>
                    )}
                    
                    {existingCourses.length > 0 && (
                        <div className="mt-2 p-3 rounded-md border">
                            <p className="text-sm mb-2 font-medium">Cours similaires:</p>
                            <ul className="space-y-1 max-h-40 overflow-y-auto">
                                {existingCourses.map((course) => (
                                    <li 
                                        key={course.id}
                                        className={`text-sm p-1.5 rounded ${
                                            course.name.toLowerCase() === courseName.toLowerCase()
                                                ? 'font-medium'
                                                : ''
                                        }`}
                                    >
                                        {course.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Date de début:</label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Appellation:</label>
                    <Input
                        type="text"
                        value={abbreviation}
                        onChange={(e) => setAbbreviation(e.target.value)}
                        placeholder="Ex: MATH101"
                        required
                    />
                    <p className="text-xs">Abréviation utilisée pour identifier le cours</p>
                </div>

                <div className="pt-3">
                    <LoadButton 
                        text="Créer le cours" 
                        onSubmit={()=>handleSubmit}
                        loading={loading}
                        disabled={isDuplicate || loading}
                        className="w-full py-2.5 rounded-md shadow"
                    />
                </div>
            </form>
        </div>
    );
};

export default CreateCourse;