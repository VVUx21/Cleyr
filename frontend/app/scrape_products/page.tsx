import Searchbar from "@/components/searchbar"
// import { getAllProducts } from "@/lib/actions"
// import ProductCard from "@/components/ProductCard"

const Home = async () => {
  //const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center"> 
            <Searchbar />
          </div>
          {/* <HeroCarousel /> */}
        </div>
      </section>
    </>
  )
}

export default Home