const STORAGE_KEY = "teranga_products";
const API_BASE_URL = "http://127.0.0.1:8000/api";

const defaultProducts = [
 {id:1,name:"Tomates fraîches",category:"Légumes",price:500,unit:"kg",quantity:200,region:"Thiès",producer:"Mamadou",phone:"771234567",description:"Tomates fraîches récoltées dans nos champs.",image:""},
 {id:2,name:"Mangues",category:"Fruits",price:800,unit:"kg",quantity:150,region:"Ziguinchor",producer:"Ibrahima",phone:"761234567",description:"Mangues locales de bonne qualité.",image:""},
 {id:3,name:"Riz local",category:"Céréales",price:18000,unit:"sac",quantity:50,region:"Saint-Louis",producer:"Abdoulaye",phone:"781234567",description:"Riz local disponible en sacs.",image:""}
];

const CATEGORY_LABELS = {
 vegetables: "Légumes",
 fruits: "Fruits",
 cereals: "Céréales",
 other: "Autres"
};

const CATEGORY_API_VALUES = {
 "légumes": "vegetables",
 "legumes": "vegetables",
 "fruits": "fruits",
 "céréales": "cereals",
 "cereales": "cereals",
 "autres": "other"
};

function getProducts(){
 const saved=localStorage.getItem(STORAGE_KEY);
 if(saved===null){localStorage.setItem(STORAGE_KEY,JSON.stringify(defaultProducts));return defaultProducts}
 try{const data=JSON.parse(saved);return Array.isArray(data)?data:defaultProducts}catch{return defaultProducts}
}
function saveProducts(products){localStorage.setItem(STORAGE_KEY,JSON.stringify(products))}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function formatPrice(price){return Number(price).toLocaleString("fr-FR")+" FCFA"}
function formatPhone(phone){
 let number=String(phone??"").replace(/\D/g,"");
 if(number.startsWith("00"))number=number.slice(2);
 if(number.startsWith("0"))number="221"+number.slice(1);
 else if(number.length===9)number="221"+number;
 return number;
}
function createProductCard(product,producerMode=false){
 const card=document.createElement("article");card.className="product-card";
 const image=product.image_url||product.image||"https://placehold.co/600x400?text=Produit+agricole";
 const producer=product.producer_name||product.producer||"Producteur";
 const phone=product.whatsapp_phone||product.phone||"";
 const category=CATEGORY_LABELS[product.category]||product.category;
 card.innerHTML=`<img class="product-image" src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}">
 <div class="product-info"><h3>${escapeHTML(product.name)}</h3>
 <div class="product-price">${formatPrice(product.price)} / ${escapeHTML(product.unit)}</div>
 <p>Catégorie : ${escapeHTML(category)}</p><p>Quantité : ${escapeHTML(product.quantity)} ${escapeHTML(product.unit)}</p>
 <p>Région : ${escapeHTML(product.region)}</p><p>Producteur : ${escapeHTML(producer)}</p>
 ${product.description?`<p>${escapeHTML(product.description)}</p>`:""}
 ${producerMode?`<button type="button" class="delete-btn" data-id="${Number(product.id)}">Supprimer l'annonce</button>`:
 `<a class="contact-btn" href="https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent("Bonjour, je suis intéressé par votre produit : "+product.name)}" target="_blank" rel="noopener noreferrer">Contacter le producteur</a>`}</div>`;
 return card;
}

/* Interface acheteur : lecture directe depuis l'API Django */
const productGrid=document.getElementById("productGrid");
if(productGrid){
 const search=document.getElementById("search");
 const category=document.getElementById("category");
 const region=document.getElementById("region");
 const empty=document.getElementById("empty");
 let activeController=null;

 async function displayProducts(){
  if(activeController) activeController.abort();
  activeController=new AbortController();

  const term=search.value.trim();
  const params=new URLSearchParams();

  if(term) params.set("search",term);

  const selectedCategory=category.value.trim().toLowerCase();
  if(selectedCategory!=="all"){
   const apiCategory=CATEGORY_API_VALUES[selectedCategory];
   if(apiCategory) params.set("category",apiCategory);
  }

  if(region.value!=="all") params.set("region",region.value);

  productGrid.replaceChildren();
  empty.textContent="Chargement des produits...";
  empty.classList.remove("hidden");

  try{
   const response=await fetch(`${API_BASE_URL}/products/?${params.toString()}`,{
    method:"GET",
    headers:{"Accept":"application/json"},
    signal:activeController.signal
   });

   if(!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

   const data=await response.json();
   const products=Array.isArray(data)?data:(data.results||[]);

   productGrid.replaceChildren();
   products.forEach(product=>productGrid.appendChild(createProductCard(product)));

   empty.textContent=products.length
    ?""
    :"Aucun produit disponible. Essayez de modifier votre recherche.";
   empty.classList.toggle("hidden",products.length>0);
  }catch(error){
   if(error.name==="AbortError") return;
   console.error("Erreur de chargement des produits :",error);
   productGrid.replaceChildren();
   empty.textContent="Impossible de charger les produits. Vérifiez que le serveur Django fonctionne et réessayez.";
   empty.classList.remove("hidden");
  }
 }

 search.addEventListener("input",displayProducts);
 category.addEventListener("change",displayProducts);
 region.addEventListener("change",displayProducts);
 displayProducts();
}

/* Interface producteur : elle utilise encore le stockage local.
   Sa connexion à l'API sera faite dans une étape séparée. */
const productForm=document.getElementById("productForm");
if(productForm){
 const list=document.getElementById("producerProducts"),message=document.getElementById("formMessage"),imageInput=document.getElementById("image");
 function displayProducerProducts(){
  const products=getProducts();list.replaceChildren();
  if(!products.length){list.innerHTML="<p>Aucune annonce enregistrée pour le moment.</p>";return}
  products.forEach(p=>list.appendChild(createProductCard(p,true)));
 }
 function saveProduct(product){
  try{const products=getProducts();products.unshift(product);saveProducts(products);message.textContent="Votre produit a été publié avec succès.";message.style.color="#218c50";productForm.reset();displayProducerProducts()}
  catch{message.textContent="Stockage insuffisant. Essayez une photo plus légère.";message.style.color="#c83e3e"}
 }
 productForm.addEventListener("submit",event=>{
  event.preventDefault();message.textContent="";
  const phone=document.getElementById("phone").value.trim(),normalized=formatPhone(phone);
  if(!/^221[0-9]{9}$/.test(normalized)){message.textContent="Saisissez un numéro sénégalais valide de 9 chiffres, ou avec l'indicatif 221.";message.style.color="#c83e3e";return}
  const file=imageInput.files[0];
  if(file&&!file.type.startsWith("image/")){message.textContent="Sélectionnez un fichier image valide.";message.style.color="#c83e3e";return}
  if(file&&file.size>2*1024*1024){message.textContent="La photo ne doit pas dépasser 2 Mo.";message.style.color="#c83e3e";return}
  const product={id:Date.now(),name:document.getElementById("name").value.trim(),category:document.getElementById("category").value,price:Number(document.getElementById("price").value),unit:document.getElementById("unit").value,quantity:Number(document.getElementById("quantity").value),region:document.getElementById("region").value,producer:document.getElementById("producer").value.trim(),phone,description:document.getElementById("description").value.trim(),image:""};
  if(file){const reader=new FileReader();reader.onload=()=>{product.image=reader.result;saveProduct(product)};reader.onerror=()=>{message.textContent="Impossible de lire cette image.";message.style.color="#c83e3e"};reader.readAsDataURL(file)}
  else saveProduct(product);
 });
 list.addEventListener("click",event=>{
  const button=event.target.closest(".delete-btn");if(!button)return;
  if(!confirm("Voulez-vous vraiment supprimer cette annonce ?"))return;
  saveProducts(getProducts().filter(p=>Number(p.id)!==Number(button.dataset.id)));displayProducerProducts();
 });
 displayProducerProducts();
}
