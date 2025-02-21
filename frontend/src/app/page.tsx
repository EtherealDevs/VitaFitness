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
                <section id="hero">
                    <Hero />
                </section>
                <section id="services">
                    <Services />
                </section>
                <section id="commitment">
                    <Commitment />
                </section>
                <section id="reviews">
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
