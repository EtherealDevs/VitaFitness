import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'


export const useTeacherSchedules = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getTeacherSchedules = async () => {
        await csrf();
        try {
            const response = await axios.get("/api/teacherSchedules");
            return response.data;
          } catch (error) {
            console.error(error);
            throw error;
          }
    }
    return {
        getTeacherSchedules,
    }
}