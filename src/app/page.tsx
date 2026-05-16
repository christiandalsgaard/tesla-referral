import Hero from "@/components/landing/hero";
import Benefits from "@/components/landing/benefits";
import SignupForm from "@/components/landing/signup-form";
import Footer from "@/components/landing/footer";

// Landing page — the public face of the Tesla referral campaign.
// Assembles the hero, benefits grid, email signup, and footer.
// Fully server-rendered except the signup form (client component).
export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <SignupForm />
      <Footer />
    </>
  );
}
