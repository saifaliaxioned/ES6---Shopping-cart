const form = document.querySelector('.dataForm'),
  dropDown = document.querySelector('.dropdown'),
  dataItems = document.querySelector('.data-items'),
  deleteAll = document.querySelector('.clear-btn a');

let item = document.querySelector('.item'),
  quantity = document.querySelector('.quantity'),
  data = JSON.parse(localStorage.getItem('itemName')),
  collection = data ? data : [],
  editId = null;

let api = async () => {
  let data = await fetch('https://fakestoreapi.com/products');
  return data.json();
}

api().then((res) => {
  // dropdown 
  let price;
  item.addEventListener('keyup', () => {
    dropDown.innerHTML = '';
    res.map(obj => {
      const title = obj.title.toLowerCase();
      const itemValue = item.value.toLowerCase();
      if (title.includes(itemValue)) {
        let li = document.createElement('li')
        li.innerHTML = `<li class="drop-list">${title}</li>`;
        dropDown.appendChild(li);
      }
    });
    const dropList = document.querySelectorAll('.drop-list');
    dropList.forEach(list => {
      list.addEventListener('click', () => {
        item.value = list.innerText;
        dropDown.innerHTML = '';
      })
    });
  });
  const dataLoad = () => {
    if (collection != null) {
      let li = '';
      collection.forEach((list, index) => {
        li += ` <li class="data-list">
        <ul class="item-store">
                  <li class="store-list">${list.item}</li>
                  <li class="store-list item-price">${list.price * list.quantity}</li>
                  <li class="store-list">
                    <a href="#FIXME" class="edit-btn" data-quant="${list.quantity} "title="Edit">edit</a>
                  </li>
                  <li class="store-list">
                    <a href="#FIXME" class="delete-btn" data-del="${index}" title="Delete">delete</a>
                  </li>
                </ul>
                </li>`;
      });
      dataItems.innerHTML = li;

      // total price
      const itemPrice = document.querySelectorAll('.item-price');
      let priceArr = [];
      itemPrice.forEach(p => {
        priceArr.push(parseFloat(p.innerText));
      });
      const sum = priceArr.reduce((a, b) => a + b, 0);
      const totalAmount = document.querySelector('.total-amount');
      if (dataItems.children.length != 0) {
        const amount = document.querySelector('.total-amount span');
        totalAmount.classList.add('show');
        amount.innerText = sum;
      } else {
        totalAmount.classList.remove('show');
      }
      
      // Delete function
      if (dataItems.children.length != 0) {
        const deleteBtn = document.querySelectorAll('.delete-btn');
        deleteBtn.forEach(delBtn => {
          delBtn.addEventListener('click', () => {
            let delIndex = delBtn.dataset.del;
            collection.splice(delIndex, 1);
            localStorage.setItem('itemName', JSON.stringify(collection));
            dataLoad();
          });
        })
      };

      // Edit function
      if (dataItems.children.length != 0) {
        const editBtn = document.querySelectorAll('.edit-btn');
        editBtn.forEach((edBtn, ind) => {
          edBtn.addEventListener('click', () => {
            editId = ind;
            item.value = edBtn.parentElement.parentElement.children[0].innerText;
            const quantityValue = edBtn.dataset.quant
            quantity.value = parseInt(quantityValue);
          })
        })
      };

      // Delete All function
      if (dataItems.children.length != 0) {
        deleteAll.addEventListener('click', () => {
          localStorage.removeItem('itemName');
          collection = [];
          dataLoad();
        })
      }

    }
  }
  // new list function
  const newList = () => {
    if (item.value.trim() != "" && quantity.value != "") {
      res.forEach(obj => {
        const title = obj.title.toLowerCase();
        const itemValue = item.value.toLowerCase();
        if (title.includes(itemValue)) {
          price = obj.price;
        }
      });

      let dataObj = {
        item: item.value,
        quantity: quantity.value,
        price: price
      }
      if (editId === null) {
        collection.push(dataObj);
      } else {
        collection[editId] = dataObj;
      }
      localStorage.setItem('itemName', JSON.stringify(collection));
      dataLoad();
      item.value = "";
      quantity.value = "";
      editId = null;
    }
  };

  // submit function
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    newList();
  });

  // intial load
  dataLoad();

}).catch((e) => {
  console.log(e.message);
});



















