export const getWhatsAppLink = (
    text: string,
    phone: string = '543794558125',
) => {
    const encodedText = encodeURIComponent(text)
    return `https://wa.me/${phone}?text=${encodedText}`
}
