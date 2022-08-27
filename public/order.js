
    window.addEventListener('DOMContentLoaded',()=>{
        console.log("Hi")
            axios.get(`http://3.82.129.88:3000/orders`).then(res => {
    
                    const cart_body = document.getElementById('allOrders');

                    for(let i=0;i<res.data.length;i++){
                        let orderDiv = ``;
                        for(let j=0;j<res.data[i].products.length;j++){
                            orderDiv +=     `
                                            <p> Products : ${res.data[i].products[j].title}</p>
                                            <p> Price : ${res.data[i].products[j].price}</p>
                                            <p> Quantity : ${res.data[i].products[j].orderItem.quantity}</p>
                                            <img class="OImage" src=${res.data[i].products[j].imageUrl} alt="">
                                        <hr>`;
                        }
                        cart_body.innerHTML+=`<div class="tile"><h3> Order ID: ${res.data[i].id}</h3>`+orderDiv+`</div>`;
                    }
                    
                    // res.data[i].products[j].title
                    // res.data[i].id+



                    // console.log(res);
                    // console.log(res.data[0].id)
                    // console.log(res.data[0].products)
                
    
            })
        
    })
