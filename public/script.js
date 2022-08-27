window.onload=function(){
const cart = document.getElementById('cart');

const parentContainer = document.getElementById('ecom');
// http://3.82.129.88

parentContainer.addEventListener('click',(e)=>{

    if (e.target.className=='addCart-button'){
        const productId = Number(e.target.parentNode.parentNode.id.split('-')[1]);
        console.log(productId)
        axios.post('http://3.82.129.88:3000/cart', { productId: productId})
        .then(response => {
            if(response.status==200){
                notification(response.data.message);
                const tip = parseInt(document.querySelector('.count').innerText);
                document.querySelector('.count').innerText = tip+1;
                
            }
            else    throw new Error('Unable to add product');
        })
        .catch(err => {
           notification(err, true);
        });

    }

    // ---
    if (e.target.className=='btnPurchase'){
        
        const productId = Number(e.target.parentNode.parentNode.id.split('-')[1]);
        console.log(productId)
        axios.post('http://3.82.129.88:3000/checkOut')
        .then(response => {
            if(response.status==200){
                notification(`Order sucessfully placed with order id = ${response.data[0].orderId}`);
            }
            else    throw new Error('Unable to order product');
        })
        .catch(err => {
           notification(err, true);
        });
        
        cart.style = "display:none;"; 
    }





    if(e.target.className=='see-cart' || e.target.className=='navCart'){

        
        const pageNumber = 1;
            axios.get(`http://3.82.129.88:3000/cart/?page=1`).then(res => {
                const cart_body = document.getElementById('cart-body');
                console.log(res)
                showCart(res.data.products);
                const cartButton = document.getElementsByClassName('cButton');
                const cPagesList = document.getElementById('cartPages');
                if(!cPagesList){
                    const lastPageC=res.data.lastPC;
                    console.log('lastpage : '+lastPageC)
                    let pageParentCart = document.getElementById('Cpagination');
                    let secondParent = document.createElement("div");
                    secondParent.setAttribute("id", "cartPages");
                    pageParentCart.appendChild(secondParent);
                    
                        for(let i=1;i<=lastPageC;i++){
                        const pages = document.createElement("button");
                        pages.classList.add('cButton');
                        pages.innerText = i;
                        secondParent.appendChild(pages);
                        }
                    
                }
                })
            
            
            
            cart.style = "display:block;";    
    }


    if(e.target.className=='cButton'){ 
            const elementsinC = Array.from(document.getElementsByClassName('cActive'));

            elementsinC.forEach(element => {
                element.classList.remove('cActive');
            });
            const pageNumber = e.target.innerHTML;
            const remElementForCart = document.getElementById('showAllC');
            if(remElementForCart){
            remElementForCart.remove();     
            }
            axios.get(`http://3.82.129.88:3000/cart/?page=${pageNumber}`).then(res => {

                const cart_body = document.getElementById('cart-body');

                    showCart(res.data.products);

            })
            e.target.classList.add('cActive');

    }

    if(e.target.className=='hide'){

        cart.style = "display:none;";

    }






    if(e.target.className=='pButton'){
        const elements = Array.from(document.getElementsByClassName('active'));

            elements.forEach(element => {
            element.classList.remove('active');
        });

        const remElement = document.getElementById('showAll');
        remElement.remove();     
        const pageNumber = e.target.innerHTML;
        axios.get(`http://3.82.129.88:3000/?page=${pageNumber}`).then((res) => {
            showProducts(res.data.products);
            console.log(res.data.totalItem);
        })
        
        e.target.classList.add('active');
        
    }



    const rem = document.getElementById('remove');
    
    if(rem){
 
        
        if (e.target.className=='remove'){
            const cPage = document.getElementById('cartPages');
        
        cPage.remove();
        e.target.parentNode.parentNode.remove();
            const productId = Number(e.target.parentNode.id.split('-')[1]);
            console.log(productId)
            axios.post('http://3.82.129.88:3000/cart-delete-item', { productId: productId})
            .then(response => {
                if(response.status==200){
                    notification(response.data.message);
                    cart.style = "display:none;";
                    if(document.querySelector('.count').innerText>0){
                        document.querySelector('.count').innerText-=1;
                    }
                    
                }
            })
            .catch(err => {
               notification(err, true);
            });
    
        }

    }
    

})
}





window.addEventListener('DOMContentLoaded',()=>{
    const pageNumber = 1;

        axios.get(`http://3.82.129.88:3000/?page=${pageNumber}`).then((res) => {
            showProducts(res.data.products);
            const lastPage=res.data.lastPage;
            let pageParent = document.getElementById('pagination');
            for(let i=2;i<=lastPage;i++){
                const pP = document.createElement("button");
                pP.classList.add('pButton');
                pP.innerText = i;
                pageParent.appendChild(pP);
            }
    })
    axios.get(`http://3.82.129.88:3000/cart/?page=${pageNumber}`).then(res => {
        let cartCount = res.data.totCartItems;
        document.querySelector('.count').innerText=cartCount;
    })


})
 



function showProducts(products){
    const parentNode = document.getElementById('section-container');
    
            let remElements = document.createElement("div");
            remElements.setAttribute("id", "showAll");
            parentNode.appendChild(remElements)


    for(let i=0;i<products.length;i++){
        console.log("data IN :"+products[i].title)
        let productHtml = `
        
             <div id="album-${products[i].id}" class="content">
                 <h4>${products[i].title}</h4>
                 <div class="section-image-container">
                    <img class="pImage" src=${products[i].imageUrl} alt="">
                 </div>
                                 <div class="prod-details">
                     <span>${products[i].price}</span>
                     <button class="addCart-button" type='button'>ADD TO CART</button>
                </div>
            </div>`
            remElements.innerHTML += productHtml
    }

}



function showCart(products){
    const parentNode = document.getElementById('cart-body');
    const block = document.getElementById('showAllC');
    if(!block){

            let remElementC = document.createElement("div");
            remElementC.setAttribute("id", "showAllC");
            parentNode.appendChild(remElementC)
    for(let i=0;i<products.length;i++){
            add_item = `<span class='cart-items' id="cart-${products[i].id}">
                                        
            <img class='cart-img' src="${products[i].imageUrl}" alt="images">
            <span style="color:rgb(225, 192, 232);font-size:50px;"> ${products[i].title}</span>
            Quantity : <span class='cart-q' style="background-color:white;color:black;padding:5px;border-radius:10px;">${products[i].cartItem.quantity}</span>               
            Price : <span class='cart-price' style="background-color:white;color:black;padding:5px;border-radius:10px;">${products[i].price}</span>
            <button id="remove" class="remove">X</button>
            </span>`
            remElementC.innerHTML+=add_item;
        }
    }     


}

function notification(res){
        const container = document.getElementById('notification-container');
        const notif = document.createElement('div');
        notif.classList.add('toast');
        notif.innerHTML = `<h3><strong style="color:red;">${res}</strong> :)<h3>`;
        container.appendChild(notif);

        setTimeout(()=>{
            notif.remove();
        },2500)
}