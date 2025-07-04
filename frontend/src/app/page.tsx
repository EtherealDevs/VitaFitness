'use client'
import Navbar from '@/components/Navbar'
import Hero from '@/components/interface/Hero'
import Services from '@/components/interface/Plans'
import Commitment from '@/components/interface/Commitment'
import Reviews from '@/components/interface/Reviews'
import Faq from '@/components/interface/Faq'
import Contact from '@/components/interface/Contact'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/auth'
/* import NavigationGuide from "@/components/NavigationGuide" */

export default function Home() {
    const { user } = useAuth()
    const isLoggedIn = user ? true : false
    return (
        <div>
            <div className="sticky top-0 z-50">
                <Navbar isLoggedIn={isLoggedIn} user={user} />
            </div>
            <main>
                {/* <NavigationGuide /> */}
                <section id="hero">
                    <Hero />
                </section>
                <section id="services">
                    <Services />
                </section>
                <section id="compromiso">
                    <Commitment />
                </section>
                <section id="resenas">
                    <Reviews />
                </section>
                <section id="faq">
                    <Faq />
                </section>
                <section id="contact">
                    <Contact />
                </section>
            </main>
            <Footer />
        </div>
    )
}
