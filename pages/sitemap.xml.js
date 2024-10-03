const STORE_DATA_URL = "http://localhost:3002/api/lojas";
const PRODUCTS_DATA_URL = "http://localhost:3002/api/all-products";
// Função para formatar as categorias
const formatName = (name) => {
  return name
    .replace(/ /g, "-") // Substitui espaços por hífens
    .normalize("NFD") // Normaliza para separar acentos
    .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
};

function generateSiteMap(stores, products) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- URLs fixas -->
    <url>
      <loc>https://jsonplaceholder.typicode.com</loc>
    </url>
    <url>
      <loc>https://jsonplaceholder.typicode.com/guide</loc>
    </url>
    ${stores?.map(({ dominio }) => {
      console.log(dominio)
        return `
      <url>
        <loc>${`http://localhost:5002/store/${dominio}`}</loc>
      </url>
    `;
      })
      .join("")}
      
         ${products
           .map(({ name, _id }) => {
             return `
      <url>
        <loc>${`http://localhost:5002/user/product/${formatName(
          name
        )}/${_id}`}</loc>
      </url>
    `;
           })
           .join("")}
  </urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Fazemos uma chamada à API para coletar as URLs
  const request = await fetch(STORE_DATA_URL);
  const { stores } = await request.json(); // Altere para desestruturar 'categories'
  const requesProducts = await fetch(PRODUCTS_DATA_URL);
  const { products } = await requesProducts.json(); // Altere para desestruturar 'categories'
console.log(stores)
  // Geramos o XML do sitemap com os dados das categorias
  const sitemap = generateSiteMap(stores, products);

  res.setHeader("Content-Type", "text/xml");
  // Enviamos o XML para o navegador
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
