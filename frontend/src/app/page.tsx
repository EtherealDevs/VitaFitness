import Navbar from "@/components/Navbar"
import Hero from "@/components/interface/Hero"
import Services from "@/components/interface/Plans"
import Commitment from "@/components/interface/Commitment"
import Reviews from "@/components/interface/Reviews"
import Faq from "@/components/interface/Faq"
import Contact from "@/components/interface/Contact"
import Footer from "@/components/Footer"
import LoginLinks from '@/app/LoginLinks'

export default function Home() {
    return (
        <div>
            <Navbar />
            <LoginLinks/>
            <main>
                <Hero />
                <Services />
                <Commitment />
                <Reviews />
                <Contact />
                <Faq />
            </main>
            <Footer />
        </div>
    )
}

