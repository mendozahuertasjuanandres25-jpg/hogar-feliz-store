import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCatalog from "@/components/CategoryCatalog";
import electronicosImg from "@/assets/electronicos.jpg";

const SLUGS = ["celulares", "tablets", "televisores", "electrodomesticos"];

const Electronicos = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <CategoryCatalog
        slugs={SLUGS}
        title="Dispositivos electrónicos"
        subtitle="Celulares, tablets, televisores y electrodomésticos de las mejores marcas, con garantía oficial."
        heroImage={electronicosImg}
        showFilters
      />
    </main>
    <Footer />
  </div>
);

export default Electronicos;
