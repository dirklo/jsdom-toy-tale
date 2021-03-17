let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyList = document.querySelector("#toy-collection")
  const form = document.querySelector(".add-toy-form")
  const toyNameInput = document.querySelector("#toy-name-input")
  const toyImageInput = document.querySelector("#toy-image-input")

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function populateToys() {
    return fetch("http://localhost:3000/toys", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then (resp => resp.json())
    .then(function(object) {
      for(toy of object) {
        const newCard = document.createElement("div");
        newCard.classList.add("card");
        
        const name = document.createElement("h2");
        name.innerText = toy.name;
        
        const img = document.createElement("img");
        img.classList.add("toy-avatar");
        img.src = toy.image;
        
        const likeBtn = document.createElement("button");
        likeBtn.classList.add("like-btn");
        likeBtn.setAttribute("data-id", toy.id);
        likeBtn.innerText = "Like <3";
        
        const likeDisplay = document.createElement("span");
        likeDisplay.classList.add("like-display");
        likeDisplay.innerText = toy.likes + " likes";

        newCard.appendChild(name);
        newCard.appendChild(img);
        newCard.appendChild(likeBtn);
        newCard.appendChild(likeDisplay);
        toyList.appendChild(newCard);
      }
    })
  }

  populateToys()

  function addingToy(toyName, toyImage) {
    const objectData = JSON.stringify({
      'name': toyName,
      'image': toyImage,
      'likes': 0
    });
    
    const configData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: objectData
    };
      
    return fetch('http://localhost:3000/toys', configData)
    .then(resp => resp.json())
    .then(function(object) {
      console.log(object);
      while (toyList.children.length > 0) {
        delete toyList.children[0].remove()
      };
      populateToys();
      })
    .catch(error => console.log(error.message));
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    toyName = toyNameInput.value
    toyImage = toyImageInput.value
    addingToy(toyName, toyImage)
  })

  document.addEventListener('click', (e) => {
    if (Object.values(e.target.classList).includes("like-btn")){
      const toyId = e.target.dataset.id
      currentLikes = parseInt(e.target.nextElementSibling.innerText.split(" ")[0]);

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          'likes': currentLikes + 1  
        })
      })
      .then(response => response.json())
      .then(function(object) {
        e.target.nextElementSibling.innerText = `${currentLikes + 1} likes`
      })
      .catch(error => console.log(error.message))
    }
  });

});
