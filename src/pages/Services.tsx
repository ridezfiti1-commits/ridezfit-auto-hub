import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";

const Services = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Services</h1>
      </div>
      <MobileNav />
    </div>
  );
};

export default Services;