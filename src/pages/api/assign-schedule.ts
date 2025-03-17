import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { teacherId, courseId, roomId, day, startTime, endTime } = req.body;

        try {
            // Vérifiez que tous les champs sont fournis
            if (!courseId || !roomId || !day || !startTime || !endTime) {
                return res.status(400).json({ error: "Tous les champs doivent être remplis, sauf le professeur." });
            }

            // Créer le planning dans la base de données
            const schedule = await prisma.schedule.create({
                data: {
                    course: {
                        connect: { id: courseId },
                    },
                    room: {
                        connect: { id: roomId },
                    },
                    day: day as any, // Assurez-vous que le type est correct
                    startTime: new Date(`1970-01-01T${startTime}:00`), 
                    endTime: new Date(`1970-01-01T${endTime}:00`), 
                    teacher: teacherId ? { connect: { id: teacherId } } : undefined, 
                },
            });

            return res.status(200).json({ success: true, schedule });
        } catch (error) {
            console.error("Error assigning schedule:", error);
            return res.status(500).json({ error: "Une erreur est survenue lors de l'assignation du planning." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 