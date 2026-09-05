import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCatalog from "@/components/CategoryCatalog";
import juguetesImg from "@/assets/juguetes.jpg";

const SLUGS = ["juguetes"];

const Juguetes = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <CategoryCatalog
        slugs={SLUGS}
        title="Juguetes para todas las edades"
        subtitle="Peluches, bloques, autos y robots: regalos que hacen felices a los chicos, con envío a todo el país."
        heroImage={juguetesImg}
      />
    </main>
    <Footer />
  </div>
);

export default Juguetes;
