import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'


export const useTeachers = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getTeachers = async () => {
        await csrf();
        try {
            const response = await axios.get("/api/teachers");
            return response.data;
          } catch (error) {
            console.error(error);
            throw error;
          }
    }
    return {
        getTeachers,
    }
}