
export const createCourse = async (courseName: string, startDate: string, abbreviation: string) => {
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

    return await response.json();
};