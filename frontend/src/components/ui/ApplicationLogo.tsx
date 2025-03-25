import React from 'react'
import Image from 'next/image'

const ApplicationLogo: React.FC<
    {
        width?: number
        height?: number
    } & React.ImgHTMLAttributes<HTMLImageElement>
> = ({ width = 150, height = 100, ...props }) => (
    <Image
        src="/img/LogoVita.png"
        alt="Logo Vita"
        width={Number(width)} // Convertir a número si es necesario
        height={Number(height)} // Convertir a número si es necesario
        {...props}
    />
)

export default ApplicationLogo
