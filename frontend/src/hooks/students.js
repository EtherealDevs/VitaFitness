import useSWR from 'swr'
import axios from '@/lib/axios'
/* import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation' */


export const useStudents = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const getStudents = async () => {
        await csrf();
        const { data } = useSWR('/api/students', () =>
            axios
                .get('/api/students')
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status!== 409) throw error
                })
            )
            console.log(csrf);
            console.log (data)
    }
    return {
        getStudents,
    }
    
    // const { data } = useSWR('/api/students', () =>
    //     axios
    //         .get('/api/students')
    //         .then(res => res.data)
    //         .catch(error => {
    //             if (error.response.status !== 409) throw error

    //             router.push('/verify-email')
    //         }),
    // )

}