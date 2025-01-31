import Navbar from "@/components/Navbar"
import Hero from "@/components/interface/Hero"
import Services from "@/components/interface/Plans"
import Commitment from "@/components/interface/Commitment"
import Reviews from "@/components/interface/Reviews"
import Faq from "@/components/interface/Faq"
import Contact from "@/components/interface/Contact"
import Footer from "@/components/Footer"

export default function Home() {
    return (
        <div>
            <Navbar />
            <main>
                <Hero />
                <Services />
                <Commitment />
                <Reviews />
                <Faq />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}

