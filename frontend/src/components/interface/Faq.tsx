"use client"
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const Faq = () => {
    const faqs = [
        {
            question: "¿Cuál es el horario del gimnasio?",
            answer: "Nuestro gimnasio está abierto de lunes a viernes de 6:00 AM a 10:00 PM, y los sábados y domingos de 8:00 AM a 8:00 PM."
        },
        {
            question: "¿Ofrecen entrenamiento personal?",
            answer: "Sí, ofrecemos servicios de entrenamiento personal. Puedes contratar sesiones individuales o incluirlas en nuestro Plan Premium."
        },
        {
            question: "¿Cuál es la política de cancelación de membresía?",
            answer: "Puedes cancelar tu membresía en cualquier momento con un aviso de 30 días. No hay penalizaciones por cancelación."
        },
        {
            question: "¿Tienen duchas y vestuarios?",
            answer: "Sí, contamos con duchas y vestuarios completamente equipados para tu comodidad."
        }
    ];

    return (
        <div className="w-full px-4 pt-16">
            <h2 className='mb-3 text-center font-bold text-3xl text-white'>
                Preguntas Frecuentes
            </h2>
            <div className="mx-auto w-full rounded-2xl bg-transparent p-2">
                {faqs.map((faq, index) => (
                    <Disclosure as="div" key={index} className="mr-auto ml-auto hover:w-5/6 w-4/5 mt-2">
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex w-full justify-between rounded-lg text-white bg-gradient-to-r from-[#6c70b8] to-[#2B2C49] px-4 py-2 text-left text-sm font-bold hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                    <span>{faq.question}</span>
                                    <ChevronUpIcon
                                        className={`${open ? 'rotate-180 transform' : ''} h-6 w-5 text-purple-500`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-300">
                                    {faq.answer}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </div>
    );
};

export default Faq;
