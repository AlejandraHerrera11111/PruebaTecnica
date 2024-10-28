const fs = require('fs');
const csv = require('csv-parser');
const builder = require('xmlbuilder');

const filePathCategories = 'C:\\Users\\U-tad\\Downloads\\PruebasCandidatos\\Catalog\\Categories.csv'; 
const filePathProducts = 'C:\\Users\\U-tad\\Downloads\\PruebasCandidatos\\Catalog\\Products.csv'; 

const results = [];
const productsResults = [];

fs.createReadStream(filePathCategories)
  .pipe(csv({ separator: ';' })) 
  .on('data', (data) => results.push(data)) 
  .on('end', () => {
    fs.createReadStream(filePathProducts)
      .pipe(csv({ separator: ';' })) 
      .on('data', (data) => productsResults.push(data))
      .on('end', () => {
        const catalog = results.map(category => {
          return {
            ...category, 
            products: productsResults.filter(product => product.CategoryId === category.Id)
          };
        });

        const json = JSON.stringify(catalog, null, 2);
        fs.writeFileSync('catalog.json', json);
        console.log('Archivo CSV convertido a JSON y guardado como catalog.json');

        const transformedCatalog = catalog.map(category => {
          return {
            Id: Number(category.Id),
            Name: category.Name,
            Description: category.Description,
            Products: category.products.map(product => {
              return {
                Id: Number(product.Id),
                CategoryId: Number(product.CategoryId),
                Name: product.Name,
                Price: parseFloat(product.Price.replace(',', '.'))
              };
            })
          };
        });

        console.log(JSON.stringify(transformedCatalog, null, 2));

        const xml = generateXML(transformedCatalog);
        fs.writeFileSync('catalog.xml', xml);
        console.log('Archivo CSV convertido a XML y guardado como catalog.xml');

      })
      .on('error', (err) => {
        console.error('Error al leer el archivo de productos:', err);
      });
  })
  .on('error', (err) => {
    console.error('Error al leer el archivo de categorías:', err);
  });

function generateXML(catalog) {
  const xml = builder.create('catalog');

  catalog.forEach(category => {
    const categoryNode = xml.ele('Category')
    .ele('Description', category.Description).up()
    .ele('Id', category.Id).up()
      .ele('Name', category.Name).up();

    const productsNode = categoryNode.ele('Products');

    category.Products.forEach(product => {
      productsNode.ele('Product')
      .ele('categoryId', product.CategoryId).up()
      .ele('Id', product.Id).up()
        .ele('Name', product.Name).up()
        .ele('Price', product.Price);
    });
  });
  return xml.end({ pretty: true });
}
